export interface ProductData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

export const fetchProducts = async (lazyState: {
  page: number;
  rows: number;
}) => {
  const response = await fetch(
    `https://api.artic.edu/api/v1/artworks?page=${lazyState.page}&limit=${lazyState.rows}`
  );
  const data = await response.json();
  const optimizedData =
    data?.data.length > 0
      ? data?.data.map((d: ProductData) => {
          return {
            id: d?.id,
            title: d?.title,
            placeOfOrigin: d?.place_of_origin,
            artistDisplay: d?.artist_display,
            inscriptions: d?.inscriptions,
            startDate: d?.date_start,
            endDate: d?.date_end,
          };
        })
      : [];
  return { data, optimizedData };
};
