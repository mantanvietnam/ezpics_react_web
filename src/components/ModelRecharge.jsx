import { Modal } from "antd";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import images from "../../public/images/index2";
import { saveRequestBankingAPI } from "@/api/transaction";
import { checkTokenCookie, getCookie } from "@/utils";
import Link from "next/link";
import { useSession } from "next-auth/react";

const ModalRecharge = ({ open, handleCancel }) => {
  const { data: session } = useSession();
  let dataInforUser;
  if (getCookie("user_login")) {
    dataInforUser = JSON?.parse(getCookie("user_login"));
  } else if (session?.user_login) {
    dataInforUser = session?.user_login;
  } else {
    dataInforUser = null;
  }

  return (
    <UserInfo {...dataInforUser} open={open} handleCancel={handleCancel} />
  );
};

const UserInfo = ({
  avatar,
  name,
  account_balance,
  ecoin,
  open,
  handleCancel,
}) => {
  const [transaction, setTransaction] = useState({});
  const [inputValue, setInputValue] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [showBankTransfer, setShowBankTransfer] = useState(false);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setSelectedAmount(null);
  };

  const handleAmountClick = (amount) => {
    setInputValue(amount);
    setSelectedAmount(amount);
  };

  const handleAccept = async () => {
    if (inputValue) {
      setShowBankTransfer(true);
      try {
        const response = await saveRequestBankingAPI({
          token: checkTokenCookie(),
          money: Number(inputValue),
        });
        setTransaction(response);
        console.log(response);
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
  };

  const MoneyOptions = useMemo(() => {
    const amounts = [10000, 20000, 50000, 100000, 150000, 200000];
    return (
      <div className="grid grid-cols-3 gap-6">
        {amounts.map((amount) => (
          <div
            key={amount}
            className={`p-2 m-2 border rounded shadow cursor-pointer ${
              selectedAmount === amount ? "bg-red-500 text-white" : ""
            }`}
            onClick={() => handleAmountClick(amount)}>
            <p className="text-sm text-center">{amount.toLocaleString()} đ</p>
          </div>
        ))}
      </div>
    );
  }, [selectedAmount]);

  return (
    <Modal open={open} onCancel={handleCancel} width={600} footer={null}>
      <div className="flex flex-row justify-evenly items-center w-full mt-4 mb-2">
        <div className="flex items-center pl-2.5">
          <div className="w-10 h-12">
            <Image
              alt=""
              width={20}
              height={20}
              src={avatar}
              className="rounded-full w-10 h-10"
            />
          </div>
          <p className="font-bold pl-1">
            <span className="text-gray-600">Tên :</span> {name}
          </p>
        </div>

        <div className="flex items-center pl-2.5">
          <Image src={images.balance} alt="" width={20} height={20} />
          <p className="text-gray-800 text-sm pl-1 font-bold">
            : {account_balance?.toLocaleString()}₫
          </p>
        </div>

        <div className="flex items-center pl-2.5">
          <Image src={images.eCoin} alt="" width={20} height={20} />
          <p className="text-gray-800 text-sm font-bold pl-1">:{ecoin} ecoin</p>
        </div>
      </div>
      {showBankTransfer ? (
        <div className="flex flex-col items-center p-4">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col justify-between w-3/5 items-start">
              <p className="text-black text-left font-medium text-base mb-4">
                Quý khách thực hiện chuyển khoản ngân hàng theo thông tin:
              </p>
              <>
                <p className="text-black text-left font-medium text-base">
                  Ngân hàng <b>{transaction.name_bank}</b>
                </p>
                <p className="text-black text-left font-medium text-base">
                  Số tài khoản: <b>{transaction.number_bank}</b>
                </p>
                <p className="text-black text-left font-medium text-base">
                  Chủ tài khoản: <b>{transaction.account_holders_bank}</b>
                </p>
                <p className="text-black text-left font-medium text-base">
                  Nội dung chuyển khoản: <b>{transaction.content}</b>
                </p>
              </>
            </div>
            <Image
              src={transaction.link_qr_bank}
              priority={true}
              alt="QR Code"
              width={200}
              height={200}
            />
          </div>
          <p className="text-center text-black my-4">
            Lưu ý: Sau khi thực hiện giao dịch, hãy nhấn nút Kiểm tra giao dịch
          </p>
          <Link href="/transaction/table-1">
            <button className="mt-4 mb-4 h-10 text-white bg-red-500 w-48 mx-auto rounded">
              Kiểm tra giao dịch
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex flex-col p-4">
            <p className="text-black font-normal mb-2">Nhập số tiền :</p>
            <input
              className="p-2 mb-4 border rounded"
              type="number"
              placeholder="Nhập số tiền"
              value={inputValue}
              onChange={handleInputChange}
            />
            <p className="text-black font-normal mb-2">
              Hoặc chọn số tiền cần nạp
            </p>
            {MoneyOptions}
            <button
              className={`mt-4 mb-4 h-10 text-white bg-red-500 w-48 mx-auto rounded ${
                !inputValue ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleAccept}
              disabled={!inputValue}>
              Nạp tiền
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalRecharge;
