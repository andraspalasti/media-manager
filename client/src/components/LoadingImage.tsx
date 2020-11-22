import { Skeleton, Image, ImageProps } from "@chakra-ui/react";
import React, { Component, createRef } from "react";

interface Dimensions {
	width: number | undefined;
	height: number | undefined;
}

interface Props {
	imagePath: string;
	sizes: number[];
	style?: ImageProps;
}

interface State {
	isLoaded: boolean;
	dimensions: Dimensions;
}

export default class LoadingImage extends Component<Props, State> {
	private container = createRef<HTMLDivElement>();
	constructor(props: Props) {
		super(props);
		this.state = { isLoaded: false, dimensions: { width: undefined, height: undefined } };
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

	render() {
		const width = this.state.dimensions.width || 0;
		const size = this.props.sizes.find((size) => size > width) || "original";
		return (
			<div ref={this.container} style={{ height: "100%", width: "100%" }}>
				<Skeleton width="100%" height="100%" rounded="md" isLoaded={this.state.isLoaded}>
					{size && this.props.imagePath && (
						<Image
							src={`https://image.tmdb.org/t/p/${typeof size == "number" ? "w" : ""}${size}${this.props.imagePath}`}
							onLoad={() => this.setState({ isLoaded: true })}
							ignoreFallback
							{...this.props.style}
						/>
					)}
				</Skeleton>
			</div>
		);
	}
}
