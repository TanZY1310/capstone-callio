function QRModal({showQRModal, qrCode }) {
  return (
    <>
      {showQRModal && (
        <dialog className="modal modal-open">
          <div className="modal-box items-center text-center">
            <h3 className="font-bold text-lg">Scan QR Code</h3>
            <p className="py-2">
              Open WhatsApp → Linked Devices → Link a Device
            </p>
            {qrCode ? (
              <img
                src={qrCode}
                alt="WhatsApp QR"
                className="mx-auto w-64 h-64"
              />
            ) : (
              <span className="loading loading-spinner loading-lg" />
            )}
          </div>
        </dialog>
      )}
    </>
  );
}

export default QRModal;
