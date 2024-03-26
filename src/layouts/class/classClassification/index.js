import { useState } from "react";
import { useRef } from "react";
import { CSVLink } from "react-csv";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// sample React components
import SampleBox from "components/SampleBox";
import SampleTypography from "components/SampleTypography";
import SampleAlert from "components/SampleAlert";
import SampleButton from "components/SampleButton";
import SampleSnackbar from "components/SampleSnackbar";
import { FileUploader } from "components/FileUploader";

// sample React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ClassClassificationRequestModel from "components/request/classClassification/ClassClassificationRequestModel";
import ClassGradeExpectedInputModel from "components/request/classClassification/ClassGradeExpectedInputModel";
import { Container, Icon } from "@mui/material";
import DataTable from "components/Table/TableRoot";
import TableCustomeColumn from "components/Table/TableCustomeColumn";
import MuiDataGridRoot from "components/Table/muiDataGrid/MuiDataGridRoot";
import MuiDataGridColumn from "components/Table/muiDataGrid/MuiDataGridColumn";
import PropTypes from "prop-types";
import { useMaterialUIController } from "context";
import {
  GridRowModes,
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridCsvExportOptions,
  GridToolbarExport,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from "@mui/x-data-grid-generator";
import classGradeExpectedInputMap from "components/request/classClassification/ClassGradeExpectedInputModel";

const roles = ["Market", "Finance", "Development"];
const randomRole = () => {
  return randomArrayItem(roles);
};

function CustomDataGrid(props) {
  const { responseRows, setResponseRows } = props;
  const [csvData, setCsvData] = useState([]);

  const downloadCsv = () => {
    const formattedData = responseRows.map((row) => ({
      // Map the row data to match the CSV format
      CLASS: row.className,
      "CLASS NO": row.classNumber,
      eng_name: row.studentEnglishName,
      chi_name: row.studentChineseName,
      sex: row.sex,
      "2_discip": row.studentDisciple,
      "3_rank_class": row.studentClassRank,
      "3_rank_all": row.studentGradeRank,
      Remarks: row.remark,
      "NEW CLASS": row.newClassName,
      // Map other fields as needed
    }));
    setCsvData(formattedData);
  };

  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector slotProps={{ tooltip: { title: "Change density" } }} />
      {/* <GridToolbarExport
        csvOptions={{
          encoding: "utf-8-bom",
        }}
      /> */}
      {/* <Button onClick={downloadCsv}>
        <Icon>download</Icon>
      </Button> */}
      {
        <CSVLink onClick={downloadCsv} data={csvData} filename="export.csv" encoding="utf-8">
          <Button>
            <Icon>download</Icon>Download
          </Button>
        </CSVLink>
      }
    </GridToolbarContainer>
  );
}

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector slotProps={{ tooltip: { title: "Change density" } }} />
      <GridToolbarExport
        csvOptions={{
          encoding: "utf-8-bom",
        }}
      />
      <Button onClick={console.log()}>
        <Icon fontSize="medium" color="inherit">
          download
        </Icon>
        Download
        <CSVLink data={csvData} filename="export.csv" encoding="utf-8">
          Download CSV
        </CSVLink>
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
    console.log(rowModesModel);
    setRowModesModel(newRowModesModel);
  };

  const handleButtonClick = (event) => {
    // Handle the button click event
    console.log(rows);
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
      rankLimit: rankLimitNumberArray[0],
    },
    {
      id: 2,
      grade: "2",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[0],
    },
    {
      id: 3,
      grade: "3",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[0],
    },
    {
      id: 4,
      grade: "4",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[0],
    },
    {
      id: 5,
      grade: "5",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[0],
    },
    {
      id: 6,
      grade: "6",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
      rankLimit: rankLimitNumberArray[0],
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
    console.log(classDivisionRequestBody);
    var blob = new Blob([JSON.stringify(classDivisionRequestBody)], { type: "application/json" });
    console.log(blob);
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
      })
      .catch((error) => console.log(error));

    console.log(responseRows);
  };

  const downloadCvs = () => {};

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
                  //backgroundColor: "blue",
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
              //editMode="row"
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
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
                new MuiDataGridColumn("newClassName", "NEW CLASS", 100, "text", "center", true, []),
              ]}
              getRowId={(row) => row.newGrade + row.studentChineseName}
              slots={{ toolbar: CustomDataGrid }}
              slotProps={{
                toolbar: { responseRows, setResponseRows },
              }}
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
            />
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

CustomDataGrid.propTypes = {
  responseRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  setResponseRows: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ClassClassification;
