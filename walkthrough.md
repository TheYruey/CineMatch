# Walkthrough - Watch Trailer Functionality

I have implemented the functionality to watch the official YouTube trailer within the `MovieModal`.

## Changes

### 1. API Service (`src/services/api.ts`)
- Added `fetchMovieVideos` function to fetch videos from TMDB.
- Updated imports to include `Video` type.

### 2. Types (`src/types.ts`)
- Added `Video` interface to define the structure of video data from TMDB (key, site, type, etc.).

### 3. Movie Modal (`src/components/MovieModal.tsx`)
- Added state `trailerKey` to store the YouTube video ID.
- Used `useEffect` to fetch videos when a movie is selected.
- Filtered results to find the first video where `site === "YouTube"` and `type === "Trailer"`.
- Added an `iframe` to embed the YouTube player, styled to be responsive.
- The player only renders if a trailer is found.

## Verification Results

### Automated Checks
- Verified that `fetchMovieVideos` is correctly exported and typed.
- Verified that `MovieModal` handles the `trailerKey` state and renders the iframe conditionally.

### Manual Verification
- **Action**: Open a movie card.
- **Expected**: The modal opens, and if a trailer exists, a YouTube player appears below the synopsis.
- **Action**: Close the modal.
- **Expected**: The video stops playing (component unmounts).
