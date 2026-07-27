import { useRef } from 'react';

export default function UserPreferences(preferences) {
  const contentRef = useRef(null);

  const handleBlur = () => {
    // Reads plain text when the user clicks away
    const plainText = contentRef.current.innerText;
    console.log('Saved text:', plainText);
    
    // Perform your submit or state update logic here, which is not done just yet cuz no GSheets
  };

  return (
    <div
      ref={contentRef}
      contentEditable
      onBlur={handleBlur}
      style={{ border: '1px solid #ccc', padding: '8px', minHeight: '40px' }}
      suppressContentEditableWarning={true}
    >
      <p>{preferences}</p>
    </div>
  );
}
