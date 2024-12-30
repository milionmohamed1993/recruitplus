import { FormSection } from "./forms/FormSection";
import { useAddCandidate } from "./forms/useAddCandidate";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ProfessionalInfoFields } from "./ProfessionalInfoFields";
import { WorkReferenceFields } from "./WorkReferenceFields";
import { ResumeUpload } from "./ResumeUpload";
import { SkillsInput } from "./SkillsInput";

export function AddCandidateForm() {
  const { formData, handlers } = useAddCandidate();

  return (
    <form id="add-candidate-form" onSubmit={handlers.handleSubmit} className="space-y-8">
      <div className="space-y-6 bg-white rounded-lg shadow-lg p-6">
        <FormSection title="Persönliche Informationen">
          <PersonalInfoSection
            name={formData.name}
            setName={formData.setName}
            email={formData.email}
            setEmail={formData.setEmail}
            phone={formData.phone}
            setPhone={formData.setPhone}
            birthdate={formData.birthdate}
            setBirthdate={formData.setBirthdate}
            address={formData.address}
            setAddress={formData.setAddress}
            nationality={formData.nationality}
            setNationality={formData.setNationality}
            location={formData.location}
            setLocation={formData.setLocation}
            gender={formData.gender}
            setGender={formData.setGender}
            source={formData.source}
            setSource={formData.setSource}
          />
        </FormSection>

        <FormSection title="Berufliche Informationen">
          <ProfessionalInfoFields
            position={formData.position}
            setPosition={formData.setPosition}
            company={formData.company}
            setCompany={formData.setCompany}
            department={formData.department}
            setDepartment={formData.setDepartment}
            industry={formData.industry}
            setIndustry={formData.setIndustry}
            experience={formData.experience}
            setExperience={formData.setExperience}
            education={formData.education}
            setEducation={formData.setEducation}
            university={formData.university}
            setUniversity={formData.setUniversity}
          />
        </FormSection>

        <FormSection title="Fähigkeiten">
          <SkillsInput 
            skills={formData.skills} 
            setSkills={formData.setSkills}
          />
        </FormSection>

        <FormSection title="Arbeitszeugnis & Zertifikate">
          <WorkReferenceFields
            workReference={formData.workReference}
            setWorkReference={formData.setWorkReference}
            workReferenceEvaluation={formData.workReferenceEvaluation}
            setWorkReferenceEvaluation={formData.setWorkReferenceEvaluation}
            onFileSelect={handlers.handleReferenceFileSelect}
            files={formData.referenceFiles}
            onRemoveFile={handlers.handleRemoveReferenceFile}
          />
        </FormSection>

        <FormSection title="Lebenslauf (Optional)">
          <ResumeUpload onResumeAnalyzed={handlers.handleResumeAnalyzed} />
        </FormSection>
      </div>
    </form>
  );
}