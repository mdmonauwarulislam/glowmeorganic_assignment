import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { FaChevronDown } from 'react-icons/fa';
import axios from 'axios';
import type { Apitypes, APIResponse } from '../types/apitypes';

const ArtTable = () => {
  const [artworks, setArtworks] = useState<Apitypes[]>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const selectedArtworks = useRef(new Map<number, Apitypes>());
  const [visibleSelected, setVisibleSelected] = useState<Apitypes[]>([]);
  const [inputValue, setInputValue] = useState('');
  const overlayRef = useRef<OverlayPanel>(null);

  useEffect(() => {
    fetchData(page);
  }, [page]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const res = await axios.get<APIResponse>(
        `https://api.artic.edu/api/v1/artworks?page=${page}`
      );
      setArtworks(res.data.data);
      setTotalRecords(res.data.pagination.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSelectionChange = (e: { value: Apitypes[] }) => {
    const newSelections = e.value;
    const newMap = new Map(selectedArtworks.current);

    artworks.forEach((row) => {
      if (!newSelections.some((item) => item.id === row.id)) {
        newMap.delete(row.id);
      }
    });

    newSelections.forEach((item) => {
      newMap.set(item.id, item);
    });

    selectedArtworks.current = newMap;
    setVisibleSelected(Array.from(newMap.values()));
  };

  const getSelectedRows = () => {
    return artworks.filter((art) => selectedArtworks.current.has(art.id));
  };

  const selectMultiple = async (count: number) => {
    const allSelected = new Map<number, Apitypes>();
    let selectedCount = 0;
    let currentPage = 1;

    while (selectedCount < count) {
      const res = await axios.get<APIResponse>(
        `https://api.artic.edu/api/v1/artworks?page=${currentPage}`
      );
      for (let art of res.data.data) {
        if (selectedCount >= count) break;
        allSelected.set(art.id, art);
        selectedCount++;
      }
      currentPage++;
    }

    selectedArtworks.current = allSelected;
    setVisibleSelected(Array.from(allSelected.values()));
    if (page !== 1) setPage(1);
  };

  const handleOverlaySubmit = () => {
    const number = parseInt(inputValue);
    if (!isNaN(number) && number > 0) {
      selectMultiple(number);
    }
    overlayRef.current?.hide();
  };

  const renderOverlayContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <label style={{ fontSize: '14px', fontWeight: '500' }}>
        Enter number of rows to select:
      </label>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="e.g., 20"
        style={{
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
        }}
      />
      <button
        onClick={handleOverlaySubmit}
        style={{
          padding: '8px',
          backgroundColor: '#22c55e',
          color: '#fff',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px',
          border: 'none',
        }}
      >
        Select
      </button>
    </div>
  );

  const Loader = () => (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'white',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          width: '48px',
          height: '48px',
          border: '4px dotted #22c55e',
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 2s linear infinite',
        }}
      />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  return (

        <div style={{ padding: '20px'}}>
      <h2 style={{ fontSize: '20px', }}>Data Table</h2>

      <OverlayPanel
        ref={overlayRef}
        showCloseIcon
        dismissable
        style={{ padding: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.15)' }}
      >
        {renderOverlayContent()}
      </OverlayPanel>

      {loading ? (
        <Loader />
      ) : (
        <DataTable
          value={artworks}
          paginator
          rows={12}
          first={(page - 1) * 12}
          totalRecords={totalRecords}
          onPage={(e) => setPage((e.page ?? 0) + 1)}
          selection={getSelectedRows()}
          onSelectionChange={onSelectionChange}
          selectionMode="checkbox"
          dataKey="id"
          lazy
          responsiveLayout="scroll"
          paginatorTemplate="PrevPageLink PageLinks NextPageLink"
          pt={{
            paginator: {
              root: { style: { display: 'flex', justifyContent: 'center', marginTop: '20px' } },
              pageButton: ({ context }) => ({
                style: {
                  padding: '6px 12px',
                  margin: '0 4px',
                  backgroundColor: context.active ? '#22c55e' : '#ebfcf1',
                  color: context.active ? '#fff' : '#333',
                  
                  borderRadius: '4px',
                  cursor: 'pointer'
                }
              }),
            }
          }}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3em' }} />
          <Column
            field="title"
            header={() => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 500 }}>Title</span>
                <button
                  onClick={(e) => overlayRef.current?.toggle(e)}
                  style={{
                    padding: '4px',
                    borderRadius: '4px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  title="Select N Rows"
                >
                  <FaChevronDown style={{ fontSize: '14px', color: '#555' }} />
                </button>
                
              </div>
            )}
            body={(rowData) => <span style={{ color: '#333' }}>{rowData.title}</span>}
          />
          <Column field="place_of_origin" header="Origin" sortable={false} body={(rowData) => rowData.place_of_origin || 'N/A'} />
          <Column field="artist_display" header="Artist" sortable={false} body={(rowData) => rowData.artist_display || 'N/A'} />
          <Column field="inscriptions" header="Inscriptions" sortable={false} body={(rowData) => rowData.inscriptions || 'N/A'} />
          <Column field="date_start" header="Start Year" sortable={false} />
          <Column field="date_end" header="End Year" sortable={false} />
        </DataTable>
      )}
    </div>


    
  );
};

export default ArtTable;
