import React from 'react';

const CropImage = ({ src, alt }) => {
    return (
        <div className="flex justify-center mt-5">
            <img
                src={src}
                alt={alt}
                className="w-28 h-28 rounded-full object-cover shadow-md"
            />
        </div>
    );
};

export default CropImage;