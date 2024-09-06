import React, { useEffect } from "react";
import BaseTable from "../../common/table/BaseTable";
import { getUsers } from "../../store/users/users.slice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../common/Loading";

const Administrator = () => {
  const dispatch = useDispatch();

  const {
    loading,
    administrator: { administrators },
  } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const columns = [
    {
      title: "No.",
      renderCell: (_, rowIndex, page, pageSize) => (
        <div>{(page - 1) * pageSize + rowIndex + 1}</div>
      ),
    },
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    {
      title: "Action",
      renderCell: (item) => (
        <div className="cursor-pointer">Change password</div>
      ),
    },
  ];

  return (
    <>
      <Loading isLoading={loading} />

      <div className="overflow-y-auto">
        <BaseTable columns={columns} data={administrators} />
      </div>
    </>
  );
};

export default Administrator;
