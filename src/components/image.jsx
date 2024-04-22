'use client';
import React from 'react';
import Image from 'next/image';
import Fade from '@mui/material/Fade';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const NextImage = React.forwardRef((props, ref) => {
    const { defaultSrc = '/image/default.png', src, sx, height, width, ...others } = props;
    const [source, setSource] = React.useState(src || defaultSrc);
    const [loading, setLoading] = React.useState(true);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            width: width,
            height: height,
            overflow: 'hidden',
            backgroundColor: 'background.default',
            ...sx
        }}>
            <Fade in={loading} appear={false} unmountOnExit mountOnEnter>
                <Skeleton
                    height={height}
                    width={width}
                    sx={{
                        position: 'absolute',
                        zIndex: 1,
                        borderRadius: sx?.borderRadius || '50%',
                        transform: 'scale(1)',
                    }} />
            </Fade>
            <Fade in={!loading}>
                <Image
                    {...others}

                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        ...others?.style
                    }}

                    height={height}
                    width={width}
                    alt='image'

                    src={source}
                    onLoad={() => {
                        setLoading(false)
                    }}
                    onErrorCapture={() => {
                        setSource(defaultSrc);
                    }}
                />
            </Fade>
        </Box>
    );
})
NextImage.displayName = 'NextImage'

export {NextImage}
