import { Query, Arg, Resolver } from "type-graphql";
import { VideoRequest } from "../schemas/video";
import fetch from "node-fetch";

@Resolver(VideoRequest)
export class VideoResolver {
	@Query(() => VideoRequest)
	async getVideos(@Arg("id") id: number, @Arg("type") type: "movie" | "tv"): Promise<VideoRequest> {
		return await fetch(`${process.env.BASE_URL}/${type}/${id}/videos?api_key=${process.env.API_KEY}`).then((response) => response.json());
	}
}
