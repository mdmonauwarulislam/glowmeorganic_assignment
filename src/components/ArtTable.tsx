import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import type { Apitypes, APIResponse } from '../types/apitypes';

const ArtTable = () => {
  const [artworks, setArtworks] = useState<Apitypes[]>([]);
  const [selectedRows, setSelectedRows] = useState<{ [key: number]: Apitypes }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(12);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectCount, setSelectCount] = useState<number>(0);
  const overlayRef = useRef<OverlayPanel>(null);

  const fetchData = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNum + 1}&limit=${rows}`);
      const data: APIResponse = await res.json();
      setArtworks(data.data);
      setTotalRecords(data.pagination.total);
    } catch (err) {
      console.error('Fetch failed', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page);
  }, [page, rows]);

  const handleSelectionChange = (e: any) => {
    const updated = { ...selectedRows };
    e.value.forEach((item: Apitypes) => {
      updated[item.id] = item;
    });

    Object.keys(selectedRows).forEach((id) => {
      if (!e.value.find((item: Apitypes) => item.id.toString() === id)) {
        delete updated[parseInt(id)];
      }
    });

    setSelectedRows(updated);
  };

  const getSelectedRows = () =>
    artworks.filter((item) => selectedRows[item.id]);

  const handleAutoSelect = async () => {
    let count = selectCount;
    const updatedSelected: { [key: number]: Apitypes } = { ...selectedRows };
    let currentPage = 1;

    while (count > 0) {
      const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rows}`);
      const data: APIResponse = await res.json();

      for (let item of data.data) {
        if (!updatedSelected[item.id]) {
          updatedSelected[item.id] = item;
          count--;
        }
        if (count <= 0) break;
      }

      if (data.pagination.total_pages <= currentPage) break;
      currentPage++;
    }

    setSelectedRows(updatedSelected);
    overlayRef.current?.hide();
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '1rem' }}>Artworks Table</h2>

      {loading ? (
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="p-progress-spinner p-component p-progress-spinner-circle" style={{ width: '40px', height: '40px' }}>
            <svg viewBox="25 25 50 50" className="p-progress-spinner-svg">
              <circle className="p-progress-spinner-circle" cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10" />
            </svg>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div><strong>Selected: {Object.keys(selectedRows).length}</strong></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Auto Select</span>
              <Button
                icon="pi pi-angle-down"
                className="p-button-sm p-button-text"
                onClick={(e) => overlayRef.current?.toggle(e)}
              />
              <OverlayPanel ref={overlayRef}>
                <div className="p-fluid">
                  <InputNumber
                    value={selectCount}
                    onValueChange={(e) => setSelectCount(e.value || 0)}
                    placeholder="Enter number"
                  />
                  <Button label="Submit" onClick={handleAutoSelect} className="mt-2" />
                </div>
              </OverlayPanel>
            </div>
          </div>

          <DataTable
            value={artworks}
            paginator
            rows={rows}
            rowsPerPageOptions={[12, 24, 48]}
            totalRecords={totalRecords}
            first={page * rows}
            onPage={(e) => {
              setPage(Math.floor(e.first / e.rows));
              setRows(e.rows);
            }}
            selectionMode="multiple"
            selection={getSelectedRows()}
            onSelectionChange={handleSelectionChange}
            dataKey="id"
            responsiveLayout="scroll"
            emptyMessage="No data found"
            tableStyle={{ minWidth: '60rem' }}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column field="title" header="Title"></Column>
            <Column field="place_of_origin" header="Origin"></Column>
            <Column field="artist_display" header="Artist"></Column>
            <Column field="inscriptions" header="Inscriptions"></Column>
            <Column field="date_start" header="Start Date"></Column>
            <Column field="date_end" header="End Date"></Column>
          </DataTable>
        </>
      )}
    </div>
  );
};

export default ArtTable;
