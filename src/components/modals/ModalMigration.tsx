import ReactDOM from "react-dom";
import { useModal } from "@context/ModalContext";
import CloseIcon from "@icons/CloseIcon";
import CopyIcon from "@icons/CopyIcon";
import ExportIcon from "@icons/ExportIcon";
import { useTranslation } from "react-i18next";
import { useLoading } from "@context/LoadingContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import EyeIcon from "@icons/EyeIcon";
import EyeOffIcon from "@icons/EyeOffIcon";

interface Props {
  userId: number;
}

const ModalMigration = ({ userId }: Props) => {
  const { setModal, triggerResponseAlert } = useModal();
  const { t } = useTranslation();
  const { setLoading } = useLoading();
  const close = () => setModal(null);
  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const [step, setStep] = useState<"verify" | "download">("verify");
  const [exportPassword, setExportPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getSchema = () =>
    z.object({
      password: z.string().min(1, t("errors.required")),
    });

  type FormValues = z.infer<ReturnType<typeof getSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(getSchema()),
    defaultValues: { password: "" },
  });

  const handleVerify = async (data: FormValues) => {
    setLoading(true);
    try {
      const response = await window.electronAPI.verifyUserPassword({
        userId,
        password: data.password,
      });

      if (response.success) {
        const downloadResponse = await window.electronAPI.exportDatabase();
        if (downloadResponse.success && downloadResponse.password) {
          setExportPassword(downloadResponse.password);
          setStep("download");
          setLoading(false);
        } else {
          setLoading(false);
          if (downloadResponse.error !== "Export cancelled") {
            triggerResponseAlert(downloadResponse.error);
          }
        }
      } else {
        setLoading(false);
        triggerResponseAlert(response.error);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error verifying password:", err);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(exportPassword);
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 flex justify-center items-center z-30 bg-black/10 backdrop-blur-sm"
    >
      <div
        className="w-[500px] flex flex-col p-5 gap-2 bg-white dark:bg-[#353935] rounded-[15px] border-2 border-[#b3b3b3] drop-shadow-[5px_5px_10px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-between items-center dark:text-[#b3b3b3]">
          <div className="flex gap-5">
            <ExportIcon size={40} color="#F57C00" />
            <div className="flex flex-col">
              <h2>
                {step === "verify"
                  ? t("modalMigration.title")
                  : t("modalMigration.title2")}
              </h2>
              <p className="font-extralight">
                {step === "verify"
                  ? t("modalMigration.description")
                  : t("modalMigration.description2")}
              </p>
            </div>
          </div>
          <button className="bicon" onClick={close}>
            <CloseIcon />
          </button>
        </div>
        <hr className="border border-[#b3b3b3] my-2" />

        {step === "verify" ? (
          <>
            <p className="dark:text-white">{t("modalMigration.subtitle")}</p>
            <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4 dark:text-[#b3b3b3]">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleVerify)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">
                          {t("modalMigration.input1")}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••"
                              {...field}
                              className="bg-white pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOffIcon color="#F57C00" />
                              ) : (
                                <EyeIcon color="#F57C00" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <button type="submit" className="borange">
                    {t("modalMigration.btn_verify")}
                  </button>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <>
            <p className="dark:text-white">{t("modalMigration.subtitle2")}</p>
            <div className="w-full flex flex-col gap-3 rounded-[10px] border border-[#b3b3b3] p-4 dark:text-[#b3b3b3]">
              <div className="w-full flex items-center gap-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={exportPassword}
                  readOnly
                  className="bg-gray-100 font-mono text-lg flex-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="bicon"
                >
                  {showPassword ? (
                    <EyeOffIcon color="#F57C00" />
                  ) : (
                    <EyeIcon color="#F57C00" />
                  )}
                </button>
                <button type="button" onClick={copyPassword} className="bicon">
                  <CopyIcon size={20} color="#F57C00" />
                </button>
              </div>
              <button className="borange" onClick={close}>
                {t("modalMigration.btn_close")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    modalRoot,
  );
};

export default ModalMigration;
