# Wasl hourly run v4 (cloud, monochrome engraved style)
1. `rm -f media/*` (Metricool already copied previous media).
2. Read tools/topics.md; pick NEW topics (carousel, reel, story promotes the carousel).
3. Write /tmp/spec.json in the shape of tools/v4/example_spec.json:
   - cover: kicker, line1 (2-3 words, Lalezar display), accent (2-3 words, Ruqaa script), line2 (2-3 words, outline), sub, shape
   - items: 4-5 of {label, title (<= 5 words), desc (1 sentence), fix (1 sentence)}
   - cta, story, reel.scenes: hook {line1 <=3 words, accent <=4 words}, 3 points {n,label,title<=5 words,sub}, cta
   - shapes: sphere torus cube pawn rings stack capsule (vary them)
4. `cd tools/v4 && node render4.js /tmp/spec.json ../../media <YYYYMMDD_HHMM>` (~90s)
5. Look at c1, one item slide, story, and 2 reel frames (ffmpeg -ss 1.6 / -ss 7). Text must not overflow. Fix and re-render if needed.
6. Append topics to tools/topics.md; commit; `git fetch origin main && git rebase origin/main && git push`.
7. Metricool createScheduledPost (blogId 7840219, tz Asia/Hebron), raw URL base https://raw.githubusercontent.com/omeomer916-ship-it/general-/main/media/:
   - carousel POST (all _cN.jpg in order) at now+4min
   - reel REEL (_reel.mp4, videoThumbnailUrl _cover.jpg) at now+8min
   - story STORY (_story.jpg, no text) at now+12min
