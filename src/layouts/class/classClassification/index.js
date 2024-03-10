/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";
import { useRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

// Material Dashboard 2 React components
import SampleBox from "components/SampleBox";
import SampleTypography from "components/SampleTypography";
import SampleAlert from "components/SampleAlert";
import SampleButton from "components/SampleButton";
import SampleSnackbar from "components/SampleSnackbar";
import { FileUploader } from "components/FileUploader";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ClassClassificationRequestModel from "components/request/classClassification/ClassClassificationRequestModel";
import ClassGradeExpectedInputModel from "components/request/classClassification/ClassGradeExpectedInputModel";
import { Container } from "@mui/material";
import DataTable from "components/Table/TableRoot";
import TableCustomeColumn from "components/Table/TableCustomeColumn";
import MuiDataGridRoot from "components/Table/muiDataGrid/MuiDataGridRoot";
import MuiDataGridColumn from "components/Table/muiDataGrid/MuiDataGridColumn";
import PropTypes from "prop-types";
import {
  GridRowModes,
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
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

function EditToolbar(props) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: "", age: "", isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

function ClassClassification() {
  const [successSB, setSuccessSB] = useState(false);
  const [infoSB, setInfoSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openInfoSB = () => setInfoSB(true);
  const closeInfoSB = () => setInfoSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const classOutputNumberArray = [];
  const classOutputNameArray = [];

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

  for (let i = 1; i <= 7; i++) {
    classOutputNumberArray.push(i);
  }
  for (let i = 0; i <= 6; i++) {
    classOutputNameArray.push(String.fromCharCode(65 + i));
  }

  const inputRows = [
    {
      id: 1,
      grade: "1",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
    },
    {
      id: 2,
      grade: "2",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
    },
    {
      id: 3,
      grade: "3",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
    },
    {
      id: 4,
      grade: "4",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
    },
    {
      id: 5,
      grade: "5",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
    },
    {
      id: 6,
      grade: "6",
      numberOfClass: classOutputNumberArray[0],
      firstClassName: "A",
    },
  ];

  const [rows, setRows] = useState(inputRows);
  const [rowModesModel, setRowModesModel] = useState({});
  const [responseRows, setResponseRows] = useState({});

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
      50
    );

    var grade2ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[1].numberOfClass,
      rows[1].firstClassName,
      50
    );

    var grade3ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[2].numberOfClass,
      rows[2].firstClassName,
      50
    );
    var grade4ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[3].numberOfClass,
      rows[3].firstClassName,
      50
    );

    var grade5ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[4].numberOfClass,
      rows[4].firstClassName,
      50
    );

    var grade6ExpectedInputMap = new ClassGradeExpectedInputModel(
      rows[5].numberOfClass,
      rows[5].firstClassName,
      50
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
              rows={rows}
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
          <SampleButton color="primary" onClick={handleButtonClick}>
            Generate
          </SampleButton>
        </Grid>

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
            rows={responseRows}
            columns={[
              new MuiDataGridColumn(
                "originalGrade",
                "originalGrade",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn("newGrade", "newGrade", 100, "text", "center", false, []),
              new MuiDataGridColumn(
                "studentClassRank",
                "studentClassRank",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn(
                "studentGradeRank",
                "studentGradeRank",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn(
                "originalClassName",
                "originalClassName",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn(
                "newClassName",
                "newClassName",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn(
                "studentEnglishName",
                "studentEnglishName",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn(
                "studentChineseName",
                "studentChineseName",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn(
                "studentChineseName",
                "studentChineseName",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn(
                "studentGender",
                "studentGender",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn(
                "studentDisciple",
                "studentDisciple",
                100,
                "text",
                "center",
                false,
                []
              ),
              new MuiDataGridColumn("remark", "remark", 100, "text", "center", false, []),
            ]}
            getRowId={(row) => row.newGrade + row.studentChineseName}
            //editMode="row"
            slots={{ toolbar: GridToolbar }}
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
          />
        </Box>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}

EditToolbar.propTypes = {
  setRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  setRowModesModel: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ClassClassification;
