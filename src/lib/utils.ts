

export function range(size: number, startAt = 0) {
    if (size <= 0) return []
    return [...Array(Math.floor(size)).keys()].map((i) => i + startAt);
}
