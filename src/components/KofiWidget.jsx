import { useEffect } from 'react';

const KofiWidget = () => {
    return (
        <div className="fixed bottom-4 right-4">
            <a href='https://ko-fi.com/W7W41IRUAR' target='_blank' rel="noopener noreferrer">
                <img
                    height='48'
                    style={{ border: 0, height: '48px' }}
                    src='https://storage.ko-fi.com/cdn/kofi6.png?v=6'
                    alt='Buy Me a Coffee at ko-fi.com'
                />
            </a>
        </div>
    );
};

export default KofiWidget;