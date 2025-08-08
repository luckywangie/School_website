// src/components/Card.jsx
function Card({ image, title, description, onClick, children }) {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
      onClick={onClick}
    >
      {image && (
        <img
          src={image}
          alt={title || "Card image"}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
        {description && (
          <p className="text-gray-600 text-sm line-clamp-3">{description}</p>
        )}
        {children && <div className="mt-2">{children}</div>} {/* ✅ render children */}
      </div>
    </div>
  );
}

export default Card;
