export async function fetchMarkers(
  query: string,
  pageSize = '1000'
): Promise<any> {
  if (Number(pageSize) > 15000)
    throw new Error('Length of parameter \'page_size\' should be from 1 to 15000')
  const url = `https://catalog.api.2gis.ru/3.0/markers?q=${encodeURI(
    query
  )}&page_size=${pageSize}&region_id=32&key=ruhebf8058`
  const response = await fetch(url)
  return await response.json()
}
