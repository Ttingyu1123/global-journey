const DIRECTIONS: Record<string, string> = {
  'asia-europe': '飛越亞洲大陸，穿過中亞草原與歐洲平原',
  'asia-africa': '飛越印度洋，穿過阿拉伯半島與紅海',
  'asia-south-america': '橫跨太平洋，飛越廣闊的海洋',
  'asia-north-america': '橫越太平洋，穿過雲海與島嶼',
  'asia-oceania': '飛越南海與印度尼西亞群島',
  'europe-africa': '穿過地中海，飛躍北非沙漠',
  'europe-south-america': '橫跨浩瀚的大西洋',
  'europe-north-america': '飛越北大西洋，穿過冰島與格陵蘭',
  'europe-oceania': '飛越亞洲大陸與印度洋',
  'africa-south-america': '橫跨大西洋',
  'africa-north-america': '飛越大西洋與加勒比海',
  'africa-oceania': '飛越印度洋與東南亞群島',
  'south-america-north-america': '飛越中美洲，穿過叢林與城市',
  'south-america-oceania': '橫越太平洋',
  'north-america-oceania': '飛越廣闊的太平洋',
}

export function getDirection(fromContinent: string, toContinent: string, fromNameZh: string, toNameZh: string): string {
  const key1 = `${fromContinent}-${toContinent}`
  const key2 = `${toContinent}-${fromContinent}`
  const direction = DIRECTIONS[key1] ?? DIRECTIONS[key2]
  if (direction) return direction
  if (fromContinent === toContinent) {
    return `穿過城市與鄉村，飛快地從${fromNameZh}朝${toNameZh}前進`
  }
  return '飛越大陸與海洋'
}
