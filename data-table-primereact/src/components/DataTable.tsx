import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator } from "primereact/paginator";
import { useEffect, useRef, useState } from "react";
import { fetchProducts } from "../services/fetch-products";
import { paginationTemplate } from "./PaginationTemplate";

// Define product interface
interface Product {
  id: number;
  title: string;
  placeOfOrigin: string;
  artistDisplay: string;
  inscriptions: string;
  startDate: string;
  endDate: string;
}

const DataTableWithPrime: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 12,
    page: 1,
  });
  const [isActive, setIsActive] = useState<boolean>(false);
  const overlayPanelRef = useRef<OverlayPanel | null>(null);
  const [customSelectionLength, setCustomSelectionLength] = useState<number>(0);

  const toggleOverlay = (event: React.MouseEvent) => {
    setIsActive((prev) => !prev);
    overlayPanelRef.current?.toggle(event);
  };

  useEffect(() => {
    async function FetchArtWork() {
      setLoading(true);
      const { data, optimizedData } = await fetchProducts(lazyState);
      setProducts(optimizedData);
      setTotalProducts(data?.pagination?.total);
      setLoading(false);
    }
    FetchArtWork();
  }, [lazyState]);

  const onPageChange = async (e: {
    rows: number;
    first: number;
    page: number;
  }) => {
    setlazyState((prev) => ({
      ...prev,
      rows: e.rows,
      first: e.first,
      page: e.page + 1,
    }));

    const remainedCheckProductsLength =
      customSelectionLength - selectedProducts.length;

    if (remainedCheckProductsLength > 1) {
      const { optimizedData } = await fetchProducts({
        page: e.page + 1,
        rows: e.rows,
      });
      setSelectedProducts((prev) => [
        ...prev,
        ...optimizedData.slice(0, remainedCheckProductsLength),
      ]);
    }
  };

  const onSelectAllChange = (event: CheckboxChangeEvent) => {
    const selectAll = event.checked;

    if (selectAll) {
      if (customSelectionLength) {
        setSelectAll(customSelectionLength === products.length);
        setSelectedProducts(products.slice(0, customSelectionLength));
      } else {
        setSelectAll(true);
        setSelectedProducts(products);
      }
    } else {
      setSelectAll(false);
      setSelectedProducts([]);
      setCustomSelectionLength(0);
    }
  };

  const onSelectCustomChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActive(false);
    overlayPanelRef.current?.hide();
    setSelectedProducts(products.slice(0, customSelectionLength));
    if (lazyState.page === 1 && customSelectionLength < products.length) {
      setSelectAll(false);
    } else if (
      customSelectionLength > products.length ||
      customSelectionLength === products.length
    ) {
      setSelectAll(true);
    }
  };

  const onRowCheckboxChange = (
    rowData: Product,
    checked: boolean | undefined
  ) => {
    const updatedSelection = checked
      ? [...selectedProducts, rowData]
      : selectedProducts.filter((item) => item.id !== rowData.id);
    setSelectedProducts(updatedSelection);
    setSelectAll(updatedSelection.length === products.length);
  };

  const checkBoxHeadTemplate = () => {
    return (
      <div className='flex items-center gap-2'>
        <Checkbox
          onChange={onSelectAllChange}
          checked={selectAll}
          aria-label='Select All'
        />
        <i
          className={`cursor-pointer text-2xl ${
            isActive
              ? "text-blue-500 pi pi-times"
              : "text-gray-600 pi pi-angle-down"
          }`}
          onClick={toggleOverlay}
        ></i>

        <OverlayPanel ref={overlayPanelRef} dismissable={false}>
          <div className='p-4'>
            <form
              onSubmit={onSelectCustomChange}
              className='flex flex-col gap-y-2'
            >
              <InputNumber
                value={customSelectionLength}
                onValueChange={(e) => setCustomSelectionLength(e.value ?? 0)}
                min={0}
                max={totalProducts}
              />
              <Button type='submit' label='Submit' severity='secondary' />
            </form>
          </div>
        </OverlayPanel>
      </div>
    );
  };

  const rowCheckboxTemplate = (rowData: Product) => {
    const isSelected = selectedProducts.some((item) => item.id === rowData.id);
    return (
      <Checkbox
        onChange={(e) => onRowCheckboxChange(rowData, e.checked)}
        checked={isSelected}
        aria-label={`Select ${rowData.title}`}
      />
    );
  };

  return (
    <div className='text-lg my-10'>
      <DataTable
        value={products}
        selectionMode='multiple'
        size='large'
        showGridlines
        lazy
        loading={loading}
        selection={selectedProducts}
        dataKey='id'
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          header={checkBoxHeadTemplate}
          body={rowCheckboxTemplate}
          headerStyle={{ width: "3rem" }}
        ></Column>
        <Column field='title' header='Title'></Column>
        <Column field='placeOfOrigin' header='Place Of Origin'></Column>
        <Column field='artistDisplay' header='Artist Display'></Column>
        <Column field='inscriptions' header='Inscriptions'></Column>
        <Column field='startDate' header='Date Start'></Column>
        <Column field='endDate' header='Date End'></Column>
      </DataTable>
      <Paginator
        template={paginationTemplate}
        first={lazyState.first}
        rows={lazyState.rows}
        totalRecords={totalProducts}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default DataTableWithPrime;
