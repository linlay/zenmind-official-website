export function statusLabel(status, copy) {
  if (status === 'preview') {
    return copy.shared.statusPreview;
  }

  if (status === 'ready') {
    return copy.shared.statusReady;
  }

  return copy.shared.statusSoon;
}
