import { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { OverlayPanel } from 'primereact/overlaypanel';
import { InputNumber } from 'primereact/inputnumber';
import type { Apitypes, APIResponse } from '../types/apitypes';
import { CgChevronDown } from 'react-icons/cg';

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
        let currentPage = page + 1;

        while (count > 0) {
            const res = await fetch(`https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rows}`);
            const data: APIResponse = await res.json();

            for (const item of data.data) {
                if (!updatedSelected[item.id]) {
                    updatedSelected[item.id] = item;
                    count--;
                    if (count === 0) {
                        setSelectedRows(updatedSelected);
                        overlayRef.current?.hide();
                        return;
                    }
                }
            }

            const totalPages = data.pagination.total_pages;
            if (currentPage >= totalPages) break;
            currentPage++;
        }

        setSelectedRows(updatedSelected);
        overlayRef.current?.hide();
    };



    return (
        <div style={{
            width: '100%',
        
          }}>


            {loading ? (
                <div style={{
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1000
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '5px solid #ccc',
                        borderTop: '5px solid #333',
                        borderRadius: '50%',
                        animation: 'spin 2s linear infinite'
                    }} />
                    <style>
                        {`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}
                    </style>
                </div>

            ) : (
                <>
                    <h2
                        style={{
                            fontSize: '1.5rem',
                            fontWeight: 500,
                            marginBottom: '1rem',
                            textAlign: 'center',
                        }}
                    >
                         Data Table
                    </h2>

                    <DataTable
                        lazy
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
                        style={{ width:'100%', }}
                        
                        
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

                        <Column
                            field="title"
                            header={() => (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <span>Title</span>

                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                        }}
                                    >
                                        <span>Auto Select</span>

                                        <button
                                            onClick={(e) => overlayRef.current?.toggle(e)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '4px 8px',
                                                color: '#1ecb5b',
                                                outline: 'none',
                                            }}
                                        >
                                        <span>
                                            <CgChevronDown size={20} />
                                        </span>
                                        </button>

                                        <OverlayPanel ref={overlayRef}>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.5rem',
                                                    padding: '0.5rem 0.75rem',
                                                }}
                                            >
                                                <InputNumber
                                                    value={selectCount}
                                                    onValueChange={(e) =>
                                                        setSelectCount(e.value || 0)
                                                    }
                                                    placeholder="Enter number"
                                                />
                                                <button
                                                    onClick={handleAutoSelect}
                                                    style={{
                                                        padding: '6px 12px',
                                                        borderRadius: '4px',
                                                        border: 'none',
                                                        backgroundColor: '#1ecb5b',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </OverlayPanel>
                                    </div>
                                </div>
                            )}
                        />

                        <Column field="place_of_origin" header="Origin" />
                        <Column field="artist_display" header="Artist" />
                        <Column field="inscriptions" header="Inscriptions" />
                        <Column field="date_start" header="Start Date" />
                        <Column field="date_end" header="End Date" />
                    </DataTable>
                </>

            )}
        </div>
    );
};

export default ArtTable;
