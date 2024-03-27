import { useState, useCallback, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

// sample React components
import SampleButton from "components/SampleButton";
import { FileUploader } from "components/FileUploader";

// sample React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ClassClassificationRequestModel from "components/request/classClassification/ClassClassificationRequestModel";
import ClassGradeExpectedInputModel from "components/request/classClassification/ClassGradeExpectedInputModel";
import { Container, Icon, Alert, AlertTitle } from "@mui/material";
import MuiDataGridColumn from "components/Table/muiDataGrid/MuiDataGridColumn";
import PropTypes from "prop-types";
import { useMaterialUIController } from "context";
import {
  GridCellModes,
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridRowEditStopReasons,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import React from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

function ShowPopupMsg(props) {
  const { message, setMessage } = props;
  return (
    <Alert severity="success">
      <AlertTitle>Success</AlertTitle>
      This is a success Alert with an encouraging title.
    </Alert>
  );
}

function CustomDataGrid(props) {
  const { responseRows, setResponseRows } = props;
  const [csvData, setCsvData] = useState([]);
  useEffect(() => {
    downloadCsv();
  }, [responseRows]);

  const downloadCsv = () => {
    if (!responseRows || responseRows.length > 0) {
      const formattedData = responseRows.map((row) => ({
        // Map the row data to match the CSV format
        CLASS: row.className,
        "CLASS NO": row.classNumber,
        eng_name: row.studentEnglishName,
        chi_name: row.studentChineseName,
        sex: row.studentGender,
        "2_discip": row.studentDisciple,
        "3_rank_class": row.studentClassRank,
        "3_rank_all": row.studentGradeRank,
        Remarks: row.remark,
        "NEW CLASS": row.newClassName,
        // Map other fields as needed
      }));
      setCsvData(formattedData);
    } else {
      const emptyDataString = [
        {
          // Map the row data to match the CSV format
          CLASS: "",
          "CLASS NO": "",
          eng_name: "",
          chi_name: "",
          sex: "",
          "2_discip": "",
          "3_rank_class": "",
          "3_rank_all": "",
          Remarks: "",
          "NEW CLASS": "",
          // Map other fields as needed
        },
      ];
      setCsvData(emptyDataString);
    }
  };

  const exportToExcel = async () => {
    downloadCsv();
    const worksheet = XLSX.utils.json_to_sheet(csvData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `export.xlsx`);
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector slotProps={{ tooltip: { title: "Change density" } }} />
      <Button onClick={exportToExcel}>
        <Icon>download</Icon>Download
      </Button>
    </GridToolbarContainer>
  );
}

function ClassClassification() {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const classOutputNumberArray = [];
  const classOutputNameArray = [];
  const rankLimitNumberArray = [];
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (openAlert) {
      const timer = setTimeout(() => {
        setOpenAlert(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [openAlert]);

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const setAlertMessageContent = (selectedSeverity, customMessage) => {
    setAlertSeverity(selectedSeverity);
    setAlertMessage(customMessage);
    setOpenAlert(true);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleButtonClick = (event) => {
    // Handle the button click event
    handleSubmit(event);
  };

  const handleClearData = (event) => {
    setResponseRows([
      {
        className: "",
        classNumber: "",
        studentEnglishName: "",
        studentChineseName: "",
        studentGender: "",
        studentDisciple: "",
        studentClassRank: "",
        studentGradeRank: "",
        remark: "",
        newClassName: "",
      },
    ]);
  };

  for (let i = 1; i <= 7; i++) {
    classOutputNumberArray.push(i);
  }
  for (let i = 0; i <= 6; i++) {
    classOutputNameArray.push(String.fromCharCode(65 + i));
  }
  for (let i = 1; i <= 50; i++) {
    rankLimitNumberArray.push(i);
  }

  const inputRows = [
    {
      id: 1,
      grade: "1",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[49],
    },
    {
      id: 2,
      grade: "2",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[49],
    },
    {
      id: 3,
      grade: "3",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[49],
    },
    {
      id: 4,
      grade: "4",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[49],
    },
    {
      id: 5,
      grade: "5",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[49],
    },
    {
      id: 6,
      grade: "6",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[49],
    },
  ];

  const [rows, setRows] = useState(inputRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [responseRows, setResponseRows] = useState([]);

  const handleFile = (file) => {
    console.log(file);
    if (file) {
      setFile(file);
      setFileName(file.name);
      setAlertMessageContent("success", "Successfully uploaded file: " + file.name);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    var myHeaders = new Headers();
    //myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "*/*");
    //myHeaders.append("Content-Type", "text/plain");
    myHeaders.append("Content-Type", "multipart/form-data");
    var formdata = new FormData();
    var grade1ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[0].numberOfClass,
      rows[0].firstClassName,
      rows[0].rankLimit
    );

    var grade2ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[1].numberOfClass,
      rows[1].firstClassName,
      rows[1].rankLimit
    );

    var grade3ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[2].numberOfClass,
      rows[2].firstClassName,
      rows[2].rankLimit
    );
    var grade4ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[3].numberOfClass,
      rows[3].firstClassName,
      rows[3].rankLimit
    );

    var grade5ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[4].numberOfClass,
      rows[4].firstClassName,
      rows[4].rankLimit
    );

    var grade6ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[5].numberOfClass,
      rows[5].firstClassName,
      rows[5].rankLimit
    );

    var classDivisionRequestBody = new ClassClassificationRequestModel(
      {
        1: grade1ExpectedInputMap,
        2: grade2ExpectedInputMap,
        3: grade3ExpectedInputMap,
        4: grade4ExpectedInputMap,
        5: grade5ExpectedInputMap,
        6: grade6ExpectedInputMap,
      },
      50,
      "A"
    );
    var blob = new Blob([JSON.stringify(classDivisionRequestBody)], { type: "application/json" });
    formdata.append("classDivisionRequest", blob);
    formdata.append("file", file);
    var requestOptions = {
      method: "POST",
      body: formdata,
    };
    fetch("http://localhost:8086/class-division/generateClassDivisionResult", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        setResponseRows(JSON.parse(result));
        setAlertMessageContent("success", "Successfully generate data from uploaded file!");
      })
      .catch((error) => setAlertMessageContent("warning", error.message));

    console.log(responseRows);
  };

  const [cellModesModel, setCellModesModel] = useState({});

  const handleCellModesModelChange = useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);

  const handleCellClick = useCallback((params, event) => {
    if (!params.isEditable) {
      return;
    }

    // Ignore portal
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    setCellModesModel((prevModel) => {
      return {
        // Revert the mode of the other cells from other rows
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
          }),
          {}
        ),
        [params.id]: {
          // Revert the mode of other cells in the same row
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
            {}
          ),
          [params.field]: { mode: GridCellModes.Edit },
        },
      };
    });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Grid
        container
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="flex-start"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <>
            <FileUploader handleFile={handleFile} />
          </>
        </Grid>
        <Grid item xs={3}>
          {fileName ? <p>Uploaded file: {fileName}</p> : null}
        </Grid>
        <Grid item xs={3}>
          <Box
            sx={{
              width: "100%",
              "& .actions": {
                color: "text.primary",
              },
              "& .textPrimary": {
                color: "text.primary",
              },
            }}
          >
            <DataGrid
              color={darkMode ? "white" : "secondary"}
              rows={rows}
              sx={{
                "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                  color: darkMode ? "grey" : "secondary",
                  fontWeight: 700,
                },
              }}
              columns={[
                new MuiDataGridColumn("grade", "Grade", 100, "text", "center", false, []),
                new MuiDataGridColumn(
                  "numberOfClass",
                  "Number Of Class",
                  200,
                  "singleSelect",
                  "center",
                  true,
                  classOutputNumberArray
                ),
                new MuiDataGridColumn(
                  "firstClassName",
                  "First Class Name",
                  200,
                  "singleSelect",
                  "center",
                  true,
                  classOutputNameArray
                ),
                new MuiDataGridColumn(
                  "rankLimit",
                  "Rank Limit",
                  200,
                  "singleSelect",
                  "center",
                  true,
                  rankLimitNumberArray
                ),
              ]}
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              cellModesModel={cellModesModel}
              onCellModesModelChange={handleCellModesModelChange}
              onCellClick={handleCellClick}
              rowFocusOut={handleCellModesModelChange}
              processRowUpdate={processRowUpdate}
              hideFooterPagination={true}
              hideFooter={true}
            />
          </Box>
        </Grid>

        <Grid item xs={3}>
          <SampleButton color={sidenavColor} onClick={handleButtonClick} disabled={!file}>
            Generate
          </SampleButton>
        </Grid>

        <Grid item xs={3}>
          <SampleButton color={sidenavColor} onClick={handleClearData}>
            Clear Data
          </SampleButton>
        </Grid>

        <Grid item xs={3}>
          <Box
            sx={{
              width: "100%",
              "& .actions": {
                color: "text.primary",
              },
              "& .textPrimary": {
                color: "text.primary",
              },
            }}
          >
            <DataGrid
              sx={{
                "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                  //backgroundColor: "blue",
                  color: darkMode ? "grey" : "secondary",
                  fontWeight: 700,
                },
              }}
              color={darkMode ? "white" : "secondary"}
              rows={
                responseRows.length > 0
                  ? responseRows
                  : [
                      {
                        className: "",
                        classNumber: "",
                        studentEnglishName: "",
                        studentChineseName: "",
                        studentGender: "",
                        studentDisciple: "",
                        studentClassRank: "",
                        studentGradeRank: "",
                        remark: "",
                        newClassName: "",
                      },
                    ]
              }
              columns={[
                new MuiDataGridColumn("className", "CLASS", 100, "text", "center", false, []),
                new MuiDataGridColumn("classNumber", "CLASS NO", 100, "text", "center", false, []),
                new MuiDataGridColumn(
                  "studentEnglishName",
                  "eng_name",
                  100,
                  "text",
                  "center",
                  false,
                  []
                ),
                new MuiDataGridColumn(
                  "studentChineseName",
                  "chi_name",
                  100,
                  "text",
                  "center",
                  false,
                  []
                ),
                new MuiDataGridColumn("studentGender", "sex", 100, "text", "center", false, []),
                new MuiDataGridColumn(
                  "studentDisciple",
                  "2_discip",
                  100,
                  "text",
                  "center",
                  false,
                  []
                ),
                new MuiDataGridColumn(
                  "studentClassRank",
                  "3_rank_class",
                  100,
                  "text",
                  "center",
                  false,
                  []
                ),
                new MuiDataGridColumn(
                  "studentGradeRank",
                  "3_rank_all",
                  100,
                  "text",
                  "center",
                  false,
                  []
                ),
                new MuiDataGridColumn("remark", "Remarks", 100, "text", "center", false, []),
                new MuiDataGridColumn(
                  "newClassName",
                  "NEW CLASS",
                  100,
                  "text",
                  "center",
                  false,
                  []
                ),
              ]}
              getRowId={(row) =>
                row.newGrade +
                row.newClassName +
                row.studentEnglishName +
                row.studentGradeRank +
                row.grade +
                row.className
              }
              slots={{ toolbar: CustomDataGrid }}
              slotProps={{
                toolbar: { responseRows, setResponseRows },
              }}
              rowSelection={false}
            />
          </Box>
        </Grid>
      </Grid>
      <div
        style={{ position: "fixed", right: "25px", bottom: "100px", width: "15%", height: "5%" }}
      >
        <Alert
          severity={alertSeverity}
          //onClose={handleAlertClose}
          sx={{ marginTop: "1rem", display: openAlert ? "block" : "none" }}
        >
          {alertMessage}
          {/* <AlertTitle>{alertSeverity.charAt(0).toUpperCase() + alertSeverity.slice(1)}</AlertTitle>
          {alertMessage} */}
        </Alert>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

CustomDataGrid.propTypes = {
  responseRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  setResponseRows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

ShowPopupMsg.propTypes = {
  message: PropTypes.arrayOf(PropTypes.object).isRequired,
  setMessage: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ClassClassification;
