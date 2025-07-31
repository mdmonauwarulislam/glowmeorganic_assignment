export interface Apitypes {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export interface APIResponse {
  pagination: {
    total_pages: number;
    current_page: number;
    total: number;
  };
  data: Apitypes[];
}
