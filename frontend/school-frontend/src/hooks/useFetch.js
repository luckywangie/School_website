import { useState, useEffect } from "react";
import api from "../services/api";

export default function useFetch(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
        const res = await api.get(cleanEndpoint);

        if (!isMounted) return;

        let responseData;

        if (Array.isArray(res.data)) {
          responseData = res.data;
        } else if (Array.isArray(res.data.results)) {
          responseData = res.data.results;
        } else {
          responseData = [];
          console.warn("Unexpected API response:", res.data);
        }

        setData(responseData);
        setError(null);
      } catch (err) {
        if (!isMounted) return;

        if (err.response) {
          if (err.response.status === 404) {
            setError("⚠️ Data not found (404). Please check the endpoint.");
          } else if (err.response.status >= 500) {
            setError("🚨 Server error (500). Please try again later.");
          } else {
            setError(err.response.data?.message || "Request failed.");
          }
        } else if (err.request) {
          setError("🌐 Network error. Please check your connection.");
        } else {
          setError(err.message || "Unknown error occurred.");
        }

        setData([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return { data, loading, error, setData };
}
