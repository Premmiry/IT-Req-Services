import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Stack, Grid, FormGroup } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import {
  FormLabel,
  Input,
  Select,
  Option,
  IconButton,
  Sheet,
  styled,
  SelectStaticProps,
  Button,
  Box,
} from "@mui/joy";
import CloseRounded from "@mui/icons-material/CloseRounded";
import { ApproveAlert } from "../Alert/alert";
import { useNavigate } from "react-router-dom";
import URLAPI from "../../../URLAPI";
import CheckboxITApprove from "../Checkbox/checkbox_it_approve";
import { User } from "lucide-react";

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography["body-sm"],
  padding: theme.spacing(0.1),
  textAlign: "center",
  color: theme.vars.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.background.level1,
  }),
}));

const fetchApproveOptions = async () => {
  const response = await fetch(`${URLAPI}/mtapprove`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

interface ApproveProps {
  name: string | null;
  status: string | null;
  req_id: string | null;
  it_m_name?: string | null; // Make id_section_competency optional
  level_job: number | null;
}

interface UserData {
  name_employee: string;
  position: string;
}

const useApproveOptions = () => {
  const [approveOptions, setApproveOptions] = useState<
    { id_approve: number; name_approve: string }[]
  >([]);

  useEffect(() => {
    fetchApproveOptions().then((data) => {
      setApproveOptions(data);
    });
  }, []);

  return approveOptions;
};

export const BoxITManagerApprove = ({
  itmanagerApprove,
  id_division_competency,
  it_m_note,
}: {
  itmanagerApprove: ApproveProps;
  id_division_competency: number | null;
  it_m_note: string | null;
}) => {
  const [value1, setValue1] = React.useState<number | null>(null);
  const approveOptions = useApproveOptions();
  const [itmanagerName, setITManagerName] = useState<string>(
    itmanagerApprove?.name || ""
  );
  const [levelJob, setLevelJob] = useState<number | null>(
    itmanagerApprove?.level_job ?? null
  );
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const action: SelectStaticProps["action"] = React.useRef(null);
  const navigate = useNavigate();

  const memoizedITManagerApprove = useMemo(() => {
    return {
      name: itmanagerApprove?.name,
      req_id: itmanagerApprove?.req_id,
      status: itmanagerApprove?.status,
      level_job: itmanagerApprove?.level_job,
    };
  }, [
    itmanagerApprove?.name,
    itmanagerApprove?.req_id,
    itmanagerApprove?.status,
    ,
    itmanagerApprove?.level_job,
  ]);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const userData: UserData = JSON.parse(storedUserData);
      setUserData(userData);

      if (
        (userData.position === "m" || userData.position === "d") &&
        !memoizedITManagerApprove.name
      ) {
        setITManagerName(userData.name_employee);
      } else if (memoizedITManagerApprove.name) {
        setITManagerName(memoizedITManagerApprove.name);
        setValue1(
          memoizedITManagerApprove.status
            ? parseInt(memoizedITManagerApprove.status)
            : null
        );
        setLevelJob(memoizedITManagerApprove.level_job);
      }

      const shouldShowSubmitButton =
        Boolean(memoizedITManagerApprove.req_id) &&
        !memoizedITManagerApprove.status &&
        userData.position === "m";
      setShowSubmitButton(shouldShowSubmitButton);
    }
  }, [memoizedITManagerApprove]);

  const handleChangeCheck =
    () => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
      setLevelJob(value);
      console.log("Level Job:", value);
    };

  const handleSubmit = useCallback(async () => {
    if (!value1) {
      alert("Status cannot be empty");
      return;
    }

    if (!itmanagerApprove.req_id) {
      alert("Request ID cannot be empty");
      return;
    }

    if (!levelJob) {
      alert("Level Job cannot be empty");
      console.log("Level Job:", levelJob);
      return;
    }

    try {
      const response = await fetch(
        `${URLAPI}/it_m_approve/${itmanagerApprove.req_id}?name=${encodeURIComponent(itmanagerName)}&status=${encodeURIComponent(value1)}&note=${encodeURIComponent(it_m_note ?? "")}&level_job=${encodeURIComponent(levelJob)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("Error:", errorMessage);
        alert(`Error: ${errorMessage}`);
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("IT-Manager approval updated successfully:", result);
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        if (id_division_competency === 86) {
          navigate("/request-list-it");
        } else {
          navigate("/request-list");
        }
      }, 2000);
    } catch (error) {
      console.error("Error updating manager approval:", error);
    }
  }, [
    value1,
    itmanagerApprove,
    itmanagerName,
    it_m_note,
    id_division_competency,
    navigate,
  ]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={6} component="div">
        <FormLabel>IT Manager Approve</FormLabel>
        <Input
          variant="outlined"
          color="success"
          type="text"
          placeholder="Manager Name"
          value={itmanagerName}
          readOnly={true}
          onChange={(e) => setITManagerName(e.target.value)}
        />
      </Grid>
      <Grid item xs={3} component="div">
        <FormLabel>Status</FormLabel>
        <Select
          action={action}
          value={value1}
          placeholder="Status"
          onChange={(_e, newValue) => {
            console.log("Selected Value:", newValue);
            setValue1(newValue);
          }}
          variant="outlined"
          color="success"
          {...(value1 && {
            indicator: null,
          })}
        >
          {approveOptions.map((option) => (
            <Option key={option.id_approve} value={option.id_approve}>
              {option.name_approve}
            </Option>
          ))}
        </Select>
      </Grid>
      <Grid item xs={3} component="div">
        {showSubmitButton && (
          <>
            <FormLabel>Approve</FormLabel>
            <Button color="success" variant="soft" onClick={handleSubmit}>
              <SaveIcon />
            </Button>
          </>
        )}
        {showAlert && (
          <ApproveAlert
            onClose={() => {
              /* Implement onClose function here */
            }}
          />
        )}
      </Grid>
      {userData?.position === "m" && (
        <Grid item xs={6} component="div">
          <FormGroup aria-label="position" row id={`checkbox_group`}>
            <CheckboxITApprove
              levelJob={levelJob}
              onChange={handleChangeCheck()}
            />
          </FormGroup>
        </Grid>
      )}
    </Grid>
  );
};

export const BoxITDirectorApprove = ({
  itdirectorApprove,
  it_m_name,
  id_section_competency,
  it_d_note,
  levelJob,
}: {
  itdirectorApprove: ApproveProps;
  it_m_name: string | null;
  id_section_competency: number;
  it_d_note: string | null;
  levelJob: number | null;
}) => {
  const [value2, setValue2] = React.useState<number | null>(null);
  const approveOptions = useApproveOptions();
  const [itdirectorName, setITDirectorName] = useState<string>(
    itdirectorApprove?.name || ""
  );
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const action: SelectStaticProps["action"] = React.useRef(null);
  const navigate = useNavigate();
//   const [levelJB, setLevelJB] = useState<number | null>(levelJob);
  const [levelJB, setLevelJB] = useState<number | null>(
    itdirectorApprove?.level_job ?? null
  );
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleChangeCheck =
    () => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(event.target.value, 10);
      setLevelJB(value);
      console.log("Level Job:", value);
    };

  const memoizedITDirectorApprove = useMemo(() => {
    return {
      name: itdirectorApprove?.name,
      req_id: itdirectorApprove?.req_id,
      status: itdirectorApprove?.status,
      level_job: itdirectorApprove?.level_job,
    };
  }, [
    itdirectorApprove?.name,
    itdirectorApprove?.req_id,
    itdirectorApprove?.status,
    itdirectorApprove?.level_job,
  ]);

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      const userData: UserData = JSON.parse(storedUserData);
      setUserData(userData);
      if (userData.position === "d" && !memoizedITDirectorApprove.name) {
        setITDirectorName(userData.name_employee);
      } else if (memoizedITDirectorApprove.name) {
        setITDirectorName(memoizedITDirectorApprove.name);
        setValue2(
          memoizedITDirectorApprove.status
            ? parseInt(memoizedITDirectorApprove.status)
            : null
        );
        setLevelJB(memoizedITDirectorApprove.level_job);
      }

      const shouldShowSubmitButton =
        Boolean(memoizedITDirectorApprove.req_id) &&
        !memoizedITDirectorApprove.status &&
        userData.position === "d";
      setShowSubmitButton(shouldShowSubmitButton);
    }
  }, [memoizedITDirectorApprove]);

  const handleSubmit = useCallback(async () => {
    if (!value2) {
      alert("Status cannot be empty");
      return;
    }

    if (!itdirectorApprove.req_id) {
      alert("Request ID cannot be empty");
      return;
    }

    if (!levelJB) {
      alert("Level Job cannot be empty");
      console.log("Level Job:", levelJB);
      return;
    }

    try {
      if (!it_m_name) {
        const response = await fetch(
          `${URLAPI}/it_m_approve/${itdirectorApprove.req_id}?name=${encodeURIComponent(itdirectorName)}&status=${encodeURIComponent(value2)}&note=${encodeURIComponent(it_d_note ?? "")}&level_job=${encodeURIComponent(levelJB ?? "")}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorMessage = await response.text();
          console.error("Error:", errorMessage);
          alert(`Error: ${errorMessage}`);
          throw new Error("Network response was not ok");
        }
      }

      const response = await fetch(
        `${URLAPI}/it_d_approve/${itdirectorApprove.req_id}?name=${encodeURIComponent(itdirectorName)}&status=${encodeURIComponent(value2)}&note=${encodeURIComponent(it_d_note ?? "")}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      console.log("IT Director approval updated successfully:", result);
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        if (id_section_competency === 28) {
          navigate("/request-list-it");
        } else {
          navigate("/request-list");
        }
      }, 2000);
    } catch (error) {
      console.error("Error updating director approval:", error);
    }
  }, [
    value2,
    itdirectorApprove,
    itdirectorName,
    it_d_note,
    id_section_competency,
    navigate,
    it_m_name,
    levelJB,
  ]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={6} component="div">
        <FormLabel>IT Director Approve</FormLabel>
        <Input
          variant="outlined"
          color="warning"
          type="text"
          placeholder="Director Name"
          value={itdirectorName}
          readOnly={true}
          onChange={(e) => setITDirectorName(e.target.value)}
        />
      </Grid>
      <Grid item xs={3} component="div">
        <FormLabel>Status</FormLabel>
        <Select
          action={action}
          value={value2}
          placeholder="Status"
          onChange={(_e, newValue) => {
            console.log("Selected Value:", newValue);
            setValue2(newValue);
          }}
          variant="outlined"
          color="warning"
          {...(value2 && {
            indicator: null,
          })}
        >
          {approveOptions.map((option) => (
            <Option key={option.id_approve} value={option.id_approve}>
              {option.name_approve}
            </Option>
          ))}
        </Select>
      </Grid>
      <Grid item xs={3} component="div">
        {showSubmitButton && (
          <>
            <FormLabel>Approve</FormLabel>
            <Button color="warning" variant="soft" onClick={handleSubmit}>
              <SaveIcon />
            </Button>
          </>
        )}
        {showAlert && (
          <ApproveAlert
            onClose={() => {
              /* Implement onClose function here */
            }}
          />
        )}
      </Grid>

      
      {userData?.position === "d" && (
        <Grid item xs={6} component="div">
          <FormGroup aria-label="position" row id={`checkbox_group`}>
            <CheckboxITApprove
              levelJob={levelJB}
              onChange={handleChangeCheck()}
            />
          </FormGroup>
        </Grid>
      )}
    </Grid>
  );
};
