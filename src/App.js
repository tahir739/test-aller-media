import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [apiResponse, setApiResponse] = useState(null);
  const [cardTitle, setCardTitle] = useState("");

  useEffect(() => {
    fetch(" https://storage.googleapis.com/aller-structure-task/test_data.json")
      .then(async (response) => {
        const data = await response.json();
        setApiResponse(data?.length ? data[0] : []);
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleTitleEditBtn = (rowIndex, colIndex, isEditTitle) => {
    let data = [...apiResponse];
    let row = data[rowIndex];
    if (!row?.columns?.length) return;

    if (isEditTitle) {
      row.columns[colIndex].isEditTitle = false;
      row.columns[colIndex].title = cardTitle;
      setCardTitle("");
    } else {
      row.columns[colIndex].isEditTitle = true;
    }

    setApiResponse(data);
  };
  const handleTitleChange = (event) => {
    setCardTitle(event.target.value);
  };

  return (
    <div className="App">
      {apiResponse?.length &&
        apiResponse.map((item, index) => {
          return (
            <div style={{ display: "grid" }} key={index}>
              {item?.columns?.length &&
                item.columns.map((column, colIndex) => {
                  column.startWidth = 1;
                  column.endWidth = column.width;
                  if (colIndex != 0) {
                    let lastColumn = item.columns[colIndex - 1];
                    column.startWidth = lastColumn.endWidth;
                    column.endWidth = lastColumn.endWidth + column.width;
                  }
                  return (
                    <div
                      style={{
                        gridColumn: `${column.startWidth}/${column.endWidth}`,
                        gridRow: `${index + 1}`,
                      }}
                      className="card"
                      key={colIndex}
                    >
                      <img src={`${column.imageUrl}`} />
                      <div className="card-title">
                        {!column?.isEditTitle && <h3>{column.title}</h3>}

                        {column?.isEditTitle && (
                          <input
                            type="text"
                            value={cardTitle || column.title}
                            style={{ width: "300px" }}
                            onChange={handleTitleChange}
                          />
                        )}
                        <input
                          type="button"
                          value={column?.isEditTitle ? "Save" : "Edit"}
                          onClick={() =>
                            handleTitleEditBtn(
                              index,
                              colIndex,
                              column?.isEditTitle
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
}

export default App;
