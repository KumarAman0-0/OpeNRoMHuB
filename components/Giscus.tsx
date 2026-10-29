"use client";

import Giscus from "@giscus/react";

// Set these up once at giscus.app, after enabling GitHub Discussions on your repo.
// Each device page passes its slug as the discussion "term" so every device gets its own thread.
export default function DeviceDiscussion({ term }: { term: string }) {
  return (
    <Giscus
      repo="KumarAman0-0/GovermentOS"
      repoId="REPLACE_WITH_REPO_ID"        // from giscus.app setup
      category="Device Discussions"
      categoryId="REPLACE_WITH_CATEGORY_ID" // from giscus.app setup
      mapping="specific"
      term={term}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="en"
      loading="lazy"
    />
  );
}
