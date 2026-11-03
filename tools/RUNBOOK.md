# Wasl hourly run (cloud, no laptop needed)
1. `rm -f media/*` (Metricool already copied previous media to its own storage).
2. Pick 2 NEW topics (one carousel, one reel) not listed in tools/topics.md.
3. Write /tmp/spec.json (same shape as tools/example_spec.json, 3-5 items; cover lines short, 1-3 words each)
   and /tmp/scenes.json (same shape as tools/example_scenes.json: hook 2.4s, 3 points 3.2s each, cta 3.6s).
4. `node tools/render.js /tmp/spec.json /tmp/scenes.json media <YYYYMMDD_HHMM>`
   Check one carousel slide + one reel frame visually (ffmpeg -ss 5 -frames:v 1) before publishing.
5. Append the two topics to tools/topics.md, commit, `git fetch origin main && git rebase origin/main`, push.
6. Metricool createScheduledPost (blogId 7840219, timezone Asia/Hebron):
   - carousel: media = raw.githubusercontent.com/omeomer916-ship-it/general-/main/media/<file> list, instagramData.type POST, publish now+5min
   - reel: media = the mp4, videoThumbnailUrl = <prefix>_cover.jpg, instagramData.type REEL, publish now+10min
