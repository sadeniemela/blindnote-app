-- Delete responses automatically when their form is deleted
ALTER TABLE "Response" DROP CONSTRAINT "Response_formId_fkey";

ALTER TABLE "Response" ADD CONSTRAINT "Response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
