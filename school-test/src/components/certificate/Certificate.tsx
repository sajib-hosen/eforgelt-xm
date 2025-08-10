import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useSelector } from "react-redux";
import { getCurrentStep } from "../../api/quiz/get-current-step";
import { RootState } from "../../redux/store/store";

const Certificate = () => {
  const certificateRef = useRef<HTMLDivElement>(null);

  // Get user name from Redux store
  const userNameFromStore = useSelector(
    (state: RootState) => state.auth.user?.name || "User"
  );

  // State for userName & certificate info
  const [userName, setUserName] = useState<string>(userNameFromStore);
  const [certification, setCertification] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [completionDate, setCompletionDate] = useState<string>("");

  useEffect(() => {
    setUserName(userNameFromStore); // sync redux name to state

    (async () => {
      try {
        const res = await getCurrentStep();

        if (res.currentStep && [1, 2, 3].includes(res.currentStep)) {
          setCurrentStep(res.currentStep);
          setCertification(res.certification || null);
          // if ("scorePercent" in res) setScorePercent(res.scorePercent);

          setCompletionDate(new Date().toLocaleDateString());
        }
      } catch (err) {
        console.error("Failed to get current step:", err);
      }
    })();
  }, [userNameFromStore]);

  const handleDownloadPDF = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF("portrait", "pt", "a4");

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("certificate.pdf");
    }
  };

  const stepToLevel = (step: number | null) => {
    switch (step) {
      case 1:
        return "A1/A2 Level Assessment";
      case 2:
        return "B1/B2 Level Assessment";
      case 3:
        return "C1/C2 Level Assessment";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        ref={certificateRef}
        className="min-w-[700px] max-w-3xl mx-auto my-10 px-8 py-10 border-4 border-yellow-500 bg-white text-black shadow-lg rounded-lg relative print:border-black"
      >
        <div className="text-center">
          <h1 className="text-3xl font-serif font-bold mb-4">
            🎓 Certificate of Achievement
          </h1>
          <p className="text-lg">This certifies that</p>
          <h2 className="text-2xl font-bold text-blue-800 mt-2">{userName}</h2>
          <p className="text-lg mt-4">has successfully completed the</p>
          <h3 className="text-xl font-semibold text-green-700 mt-1">
            {stepToLevel(currentStep)}
          </h3>
          {/* <p className="mt-4 text-gray-600">with a score of</p>
          <h4 className="text-3xl font-bold text-purple-700">
            {scorePercent !== null ? `${scorePercent.toFixed(2)}%` : "--"}
          </h4> */}
          <p className="mt-4 text-gray-500">Date: {completionDate}</p>

          {certification && (
            <p className="mt-4 font-semibold text-red-600">{certification}</p>
          )}

          <div className="mt-10 flex justify-between items-center text-sm text-gray-700">
            <div>
              <p>Instructor Signature</p>
              <div className="w-32 h-px bg-gray-400 mt-1" />
            </div>
            <div>
              <p>SkillCertify</p>
              <div className="w-24 h-px bg-gray-400 mt-1" />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Download PDF
      </button>
    </div>
  );
};

export default Certificate;
