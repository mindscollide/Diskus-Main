import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { mobileAppPopModal } from "../../../../../store/actions/UserMangementModalActions";

const MobileAppPopUpModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { UserManagementModals } = useSelector((state) => state);

  const handleOk = () => {
    const appLink = "diskus://home";
    const fallbackLink =
      "https://play.google.com/store/apps/details?id=com.axiswork.diskus";

    window.location.href = appLink;

    setTimeout(() => {
      window.location.href = fallbackLink;
    }, 2500);

    dispatch(mobileAppPopModal(false));
  };

  return (
    <section>
      <Modal
        show={UserManagementModals.mobileAppPopUp}
        setShow={(show) => dispatch(mobileAppPopModal(show))}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(mobileAppPopModal(false));
        }}
        size={"sm"}
        ModalBody={
          <>
            <div className="d-flex gap-2">
              <p>{t("Would you like to open the mobile application?")}</p>
              <Button text={t("Open")} onClick={handleOk} />
            </div>
          </>
        }
      />
    </section>
  );
};

export default MobileAppPopUpModal;
