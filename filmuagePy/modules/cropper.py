import subprocess
import os
import re


def crop_mkv(mkv_directory, srt_file_name, output_directory,file_name, start_time, end_time, srt_directory):
    # Convert start and end times to string format
    start_time_str = start_time.strftime('%H:%M:%S')
    end_time_str = end_time.strftime('%H:%M:%S')

    # Convert start and end times to seconds
    start_time_sec = sum(x * int(t) for x, t in zip([3600, 60, 1], start_time_str.split(':')))
    end_time_sec = sum(x * int(t) for x, t in zip([3600, 60, 1], end_time_str.split(':')))

    # Adjust the start time to begin 1 second earlier
    start_time_sec -= 1

    # Adjust the end time to end 1 second later
    end_time_sec += 1

    # Paths to the SRT and MKV files
    srt_file_path = os.path.join(srt_directory, srt_file_name)

    # Get the season and episode number from the SRT file name
    season_episode = re.search(r'S(\d+)E(\d+)', srt_file_name)
    if season_episode:
        season_number = season_episode.group(1)
        episode_number = season_episode.group(2)
        mkv_file_name = f'S{season_number}E{episode_number}.mkv'
    else:
        mkv_file_name = f'unknown.mkv'

    mkv_file_path = os.path.join(mkv_directory, mkv_file_name)

    # Output file path for the cropped MKV in the subject subdirectory
    output_file_path = os.path.join(output_directory, f'{file_name}.mkv')

    # Execute ffmpeg command to crop the MKV file
    ffmpeg_command = [
        'ffmpeg',
        '-i', mkv_file_path,
        '-ss', str(start_time_sec),
        '-to', str(end_time_sec),
        '-c:v', 'libx264',
        '-crf', '18',
        '-preset', 'veryfast',
        '-c:a', 'copy',
        output_file_path
    ]

    # Execute the ffmpeg command
    subprocess.run(ffmpeg_command, check=True)
