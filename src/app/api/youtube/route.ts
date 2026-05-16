import { YouTubeChannelResponse, YouTubePlaylistResponse, YouTubeVideoResponse } from "@/lib/types";
import { NextResponse } from "next/server";

function parseISO8601(duration: string) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const hours = parseInt(match?.[1] || "0");
    const minutes = parseInt(match?.[2] || "0");
    const seconds = parseInt(match?.[3] || "0");

    return hours * 3600 + minutes * 60 + seconds;
}

export async function GET() {
    const YOUTUBE_ID = process.env.YOUTUBE_ID
    const YOUTUBE_TOKEN = process.env.YOUTUBE_TOKEN

    if (!YOUTUBE_TOKEN || !YOUTUBE_ID) {
        return NextResponse.json(
            { error: "Missing API key or channel ID" },
            { status: 500 }
        );
    }

    const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_ID}&key=${YOUTUBE_TOKEN}`
    );

    const channelData = await channelRes.json() as YouTubeChannelResponse;

    const uploadsPlaylist =     
        channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylist) {
        return NextResponse.json(
            { error: "Could not find uploads playlist" },
            { status: 500 }
        );
    }

    const playlistRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylist}&maxResults=10&key=${YOUTUBE_TOKEN}`
    );

    const playlistData = await playlistRes.json() as YouTubePlaylistResponse;
    const videoIds =
        playlistData.items
            ?.map((item) => item.snippet?.resourceId?.videoId)
            .filter(Boolean)
            .join(",") || "";
    
    if (!videoIds) {
        return NextResponse.json(
            { error: "No videos found" },
            { status: 500 }
        );        
    }

    const videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_TOKEN}`
    );

    const videoData = (await videoRes.json()) as YouTubeVideoResponse;

    const filtered = (videoData.items || [])
        .map((v) => ({
            id: v.id,
            publishedAt: v.snippet.publishedAt,
            seconds: parseISO8601(v.contentDetails.duration),
        }))
        .filter((v) => v.seconds > 180)
        .sort(
            (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime()
        );

    const latestVideo = filtered[0];

    if (!latestVideo) {
        return NextResponse.json(
            { error: "No videos longer than 3 minutes found" },
            { status: 404 }
        );
    }

    return NextResponse.json({
        videoId: latestVideo.id,
    });


}