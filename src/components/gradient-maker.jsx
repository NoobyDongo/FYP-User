'use client';
import { Button } from "@/components/ui/button";
import React from "react";
import '@/styles/gradient.css';

export default function GradientMaker() {
    const gradientRef = React.useRef(null);

    React.useEffect(() => {
    }, []);

    const capture = () => {
        if (typeof window !== 'undefined') {
            const domToImage = require('dom-to-image');

            domToImage.toBlob(gradientRef.current)
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = 'my-image-name.png';
                    link.href = url;
                    link.click();
                    URL.revokeObjectURL(url);
                })
                .catch(error => {
                    console.error('oops, something went wrong!', error);
                });
        }
    };

    return (
        <>
            <Button onClick={capture} className=' z-50 relative' variant='outline'>Capture</Button>
            <div ref={gradientRef} className='gradient transition-opacity w-screen h-screen'>
                <div className="gradient-balls">
                    {/* gradient balls */}
                </div>
                <div className="gradient-balls">
                    {/* gradient balls */}
                </div>
                <div className="gradient-balls">
                    {/* gradient balls */}
                </div>
            </div>
        </>
    );
}
