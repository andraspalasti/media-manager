import { Skeleton, Image, ImageProps } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";

interface LoadingImageProps {
	imagePath: string | undefined | null;
	sizes: number[];
	style?: ImageProps;
}

const LoadingImage: React.FC<LoadingImageProps> = ({ sizes, imagePath, style }) => {
	const container = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [isLoaded, setLoaded] = useState(false);
	useEffect(() => {
		setDimensions({ width: container.current?.offsetWidth || 0, height: container.current?.offsetHeight || 0 });
	}, []);

	sizes.sort((a, b) => a - b);
	const size = dimensions.width && sizes.find((size) => size > dimensions.width);
	return (
		<div ref={container} style={{ height: "100%", width: "100%" }}>
			{!isLoaded && <Skeleton width="100%" height="100%" rounded="md"></Skeleton>}
			{size && imagePath && (
				<Image src={`https://image.tmdb.org/t/p/${size !== 0 ? `w${size}` : "original"}${imagePath}`} onLoad={() => setLoaded(true)} ignoreFallback />
			)}
		</div>
	);
};

export default LoadingImage;
