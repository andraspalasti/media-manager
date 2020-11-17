import { Skeleton, Image, ImageProps } from "@chakra-ui/core";
import React, { Component, createRef } from "react";

interface Dimensions {
	width: number | undefined;
	height: number | undefined;
}

export default class LoadingImage extends Component<
	{ imagePath: string; sizes: number[]; style?: ImageProps },
	{ isLoading: boolean; dimensions: Dimensions }
> {
	private container = createRef<HTMLDivElement>();
	constructor(
		props: { imagePath: string; sizes: number[]; style?: ImageProps } | Readonly<{ imagePath: string; sizes: number[]; style?: ImageProps }>
	) {
		super(props);
		this.state = { isLoading: false, dimensions: { width: undefined, height: undefined } };
		this.props.sizes.sort((a, b) => a - b);
	}

	componentDidMount() {
		this.setState({
			dimensions: {
				width: this.container.current?.offsetWidth,
				height: this.container.current?.offsetHeight,
			},
		});
	}

	loaded() {
		console.log("loaded");
	}

	render() {
		const width = this.state.dimensions.width || 0;
		const size = this.props.sizes.find((size) => size > width) || "original";
		// console.log(width);
		// console.log("render");
		return (
			<div ref={this.container} style={{ height: "100%" }}>
				<Skeleton width="100%" height="100%" rounded="md" isLoaded={this.state.isLoading}>
					{size && this.props.imagePath && (
						<Image
							src={`https://image.tmdb.org/t/p/${typeof size == "number" ? "w" : ""}${size}${this.props.imagePath}`}
							onLoad={() => this.setState({ isLoading: true })}
							ignoreFallback
							{...this.props.style}
						/>
					)}
				</Skeleton>
			</div>
		);
	}
}
