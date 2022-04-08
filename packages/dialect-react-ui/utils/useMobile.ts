import { useMediaPredicate } from 'react-media-hook';

export default function useMobile() {
  return useMediaPredicate('(max-width: 640px)');
}
