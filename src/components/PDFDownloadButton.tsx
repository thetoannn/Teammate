import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface PDFDownloadButtonProps {
  contentRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
  buttonText?: string;
  className?: string;
  iconSrc?: string;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  contentRef,
  fileName = "document.pdf",
  buttonText = "Tải xuống",
  className = "flex items-center gap-2 px-4 py-1 hover:bg-[#333] text-white transition-colors cursor-pointer",
  iconSrc = "/iocn-dpdf.svg",
}) => {
  const handleDownloadPDF = async () => {
    if (!contentRef.current) {
      alert("Không thể tạo PDF. Vui lòng thử lại.");
      return;
    }

    try {
      const button = document.querySelector(
        "[data-download-btn]"
      ) as HTMLButtonElement;
      if (button) {
        button.disabled = true;
        button.textContent = "Đang tạo PDF...";
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "800px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.padding = "20px";
      tempContainer.style.fontFamily = "Arial, sans-serif";
      tempContainer.style.fontSize = "14px";
      tempContainer.style.lineHeight = "1.6";
      tempContainer.style.color = "#000000";
      tempContainer.style.boxSizing = "border-box";

      const clonedContent = contentRef.current.cloneNode(true) as HTMLElement;

      const allElements = clonedContent.querySelectorAll("*");
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        htmlEl.className = "";
        htmlEl.removeAttribute("style");
      });
      clonedContent.className = "";
      clonedContent.removeAttribute("style");

      applySafePDFStyling(clonedContent);

      tempContainer.appendChild(clonedContent);
      document.body.appendChild(tempContainer);

      const canvas = await html2canvas(tempContainer, {
        scale: 1.5,
        backgroundColor: "#ffffff",
        useCORS: false,
        allowTaint: true,
        width: 800,
      });

      document.body.removeChild(tempContainer);

      const imgData = canvas.toDataURL("image/png", 0.95);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const margin = 15;
      const availableWidth = pdfWidth - 2 * margin;
      const availableHeight = pdfHeight - 2 * margin;

      const widthRatio = availableWidth / canvasWidth;
      const scaledWidth = availableWidth;
      const scaledHeight = canvasHeight * widthRatio;

      if (scaledHeight > availableHeight) {
        let remainingHeight = scaledHeight;
        let currentY = 0;
        let pageCount = 0;

        while (remainingHeight > 0) {
          if (pageCount > 0) {
            pdf.addPage();
          }

          const pageHeight = Math.min(remainingHeight, availableHeight);
          const sourceY = currentY / widthRatio;
          const sourceHeight = pageHeight / widthRatio;

          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvasWidth;
          pageCanvas.height = sourceHeight;
          const pageCtx = pageCanvas.getContext("2d");

          if (pageCtx) {
            pageCtx.drawImage(
              canvas,
              0,
              sourceY,
              canvasWidth,
              sourceHeight,
              0,
              0,
              canvasWidth,
              sourceHeight
            );

            const pageImgData = pageCanvas.toDataURL("image/png", 0.95);
            pdf.addImage(
              pageImgData,
              "PNG",
              margin,
              margin,
              scaledWidth,
              pageHeight
            );
          }

          remainingHeight -= pageHeight;
          currentY += pageHeight;
          pageCount++;
        }
      } else {
        pdf.addImage(imgData, "PNG", margin, margin, scaledWidth, scaledHeight);
      }

      pdf.save(fileName);

      if (button) {
        button.disabled = false;
        button.innerHTML = `
          <img src="${iconSrc}" alt="" />
          ${buttonText}
        `;
      }
    } catch (error) {
      console.error("Error generating PDF:", error);

      const button = document.querySelector(
        "[data-download-btn]"
      ) as HTMLButtonElement;
      if (button) {
        button.disabled = false;
        button.innerHTML = `
          <img src="${iconSrc}" alt="" />
          ${buttonText}
        `;
      }

      alert(
        "Có lỗi xảy ra khi tạo file PDF. Vui lòng kiểm tra kết nối mạng và thử lại."
      );
    }
  };

  const applySafePDFStyling = (element: HTMLElement): void => {
    const allElements = element.querySelectorAll("*");
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.setProperty("color", "#000000", "important");
      htmlEl.style.setProperty("background-color", "transparent", "important");
      htmlEl.style.setProperty("border-color", "#000000", "important");
    });

    const headings = element.querySelectorAll("h1, h2, h3, h4, h5, h6");
    headings.forEach((heading) => {
      const htmlHeading = heading as HTMLElement;
      htmlHeading.style.setProperty("font-weight", "bold", "important");
      htmlHeading.style.setProperty("margin-bottom", "12px", "important");
      htmlHeading.style.setProperty("margin-top", "16px", "important");
      htmlHeading.style.setProperty("color", "#000000", "important");
    });

    const paragraphs = element.querySelectorAll("p");
    paragraphs.forEach((p) => {
      const htmlP = p as HTMLElement;
      htmlP.style.setProperty("margin-bottom", "8px", "important");
      htmlP.style.setProperty("line-height", "1.5", "important");
      htmlP.style.setProperty("color", "#000000", "important");
    });

    const divs = element.querySelectorAll("div");
    divs.forEach((div) => {
      const htmlDiv = div as HTMLElement;
      htmlDiv.style.setProperty("margin-bottom", "8px", "important");
      htmlDiv.style.setProperty("color", "#000000", "important");
    });

    const grids = element.querySelectorAll('[class*="grid"]');
    grids.forEach((grid) => {
      const htmlGrid = grid as HTMLElement;
      htmlGrid.style.setProperty("display", "block", "important");
      htmlGrid.style.setProperty("margin-bottom", "16px", "important");
    });

    const allTextElements = element.querySelectorAll("p, div, span");
    allTextElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const text = htmlEl.textContent || "";

      // Check if this element contains a hexadecimal invoice number pattern (like c7491f8203ed)
      const hexInvoicePattern = /^[a-f0-9]{12}$/;

      const parentText = htmlEl.parentElement?.textContent || "";
      const hasInvoiceLabel = parentText.includes("Số hóa đơn");

      if (
        hexInvoicePattern.test(text.trim()) ||
        (hasInvoiceLabel && text.trim().match(/^[a-f0-9]+$/))
      ) {
        htmlEl.textContent = text.toUpperCase();
        htmlEl.style.setProperty("text-transform", "uppercase", "important");
      }
    });
  };

  return (
    <button onClick={handleDownloadPDF} data-download-btn className={className}>
      <img src={iconSrc} alt="" />
      {buttonText}
    </button>
  );
};

export default PDFDownloadButton;
