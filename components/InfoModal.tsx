interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export default function InfoModal({ isOpen, onClose, title, sections }: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b-2 border-white p-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-400 text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                {section.heading}
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-900 border-t-2 border-white p-4 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded font-bold text-white"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
