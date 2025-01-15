import { EdiotrFormProps } from "@/lib/types";
import GeneralInforForm from "./forms/GeneralInforForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";

export const steps: {
    title: string;
    componnet: React.ComponentType<EdiotrFormProps>;
    key: string;
}[] = [
        { title: "General info", componnet: GeneralInforForm, key: "general-info" },
        { title: "Personal info", componnet: PersonalInfoForm, key: "personal-info" },
        { title: "Work experience", componnet: WorkExperienceForm, key: "work-experience" },
    ]