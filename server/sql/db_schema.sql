
-- --------------------------------------------------------------------------------------CODE REFERENCES

CREATE TABLE IF NOT EXISTS Ref_UniGroup (
    Id INT PRIMARY KEY,
    Desc VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS Ref_State (
    Id INT PRIMARY KEY,
    Desc VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS Ref_StudyLevel (
    Id INT PRIMARY KEY,
    Desc VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Ref_StudyAreaQILT (
    Id INT PRIMARY KEY,
    Desc VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS Ref_StudyAreaFaculty (
    Id INT PRIMARY KEY,
    Desc VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS Ref_StudyAreaDiscipline (
    Id INT PRIMARY KEY,
    Desc VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS Ref_YearOfProgram (
    Id INT PRIMARY KEY,
    Desc VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS Ref_StudyMode (
    Id INT PRIMARY KEY,
    Desc VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS Ref_CampusType (
    Id INT PRIMARY KEY,
    Desc VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Ref_StudentType (
    Id INT PRIMARY KEY,
    Desc VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Ref_Gender (
    Id INT PRIMARY KEY,
    Desc VARCHAR(10)
);


-- ------------------------------------------------------------------------------------------ CR FRMEWORK

CREATE TABLE IF NOT EXISTS ExportYear (
    Year INT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS Mode (
    Mode VARCHAR(10) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS Ques (
    Id INT PRIMARY KEY,
    Desc VARCHAR(60)
);

CREATE TABLE IF NOT EXISTS Stage (
    Ques INT,
    Stage INT,
    Desc VARCHAR(20),
    PRIMARY KEY (Ques, Stage)
);

CREATE TABLE IF NOT EXISTS Response (
    Ques INT,
    Response INT,
    Desc VARCHAR(60),
    PRIMARY KEY (Ques, Response)
);

CREATE TABLE IF NOT EXISTS Uni (
    UniId INT PRIMARY KEY,
    Name VARCHAR(60),
    UniGroup INT,
    State INT
);


-- ------------------------------------------------------------------------------------------ CR DATA

CREATE TABLE IF NOT EXISTS CR_Student (
    UniId INT,
    Student INT,
    StudyLevel INT,
    StudyAreaQILT INT,
    StudyAreaFaculty INT,
    StudyAreaDiscipline INT,
    CohortYear INT,
    YearOfProgram INT,
    StudyMode INT,
    CreditsTotal INT,
    CreditsThisYear INT,
    CreditsPriorYears INT,
    CampusType INT,
    StudentType INT,
    Gender INT,
    PRIMARY KEY (UniId, Student),
    FOREIGN KEY (UniId) REFERENCES Uni(UniId),
    FOREIGN KEY (StudyLevel) REFERENCES Ref_StudyLevel(Id),
    FOREIGN KEY (StudyAreaQILT) REFERENCES Ref_StudyAreaQILT(Id),
    FOREIGN KEY (StudyAreaFaculty) REFERENCES Ref_StudyAreaFaculty(Id),
    FOREIGN KEY (StudyAreaDiscipline) REFERENCES Ref_StudyAreaDiscipline(Id),
    FOREIGN KEY (YearOfProgram) REFERENCES Ref_YearOfProgram(Id),
    FOREIGN KEY (StudyMode) REFERENCES Ref_StudyMode(Id),
    FOREIGN KEY (CampusType) REFERENCES Ref_CampusType(Id),
    FOREIGN KEY (StudentType) REFERENCES Ref_StudentType(Id),
    FOREIGN KEY (Gender) REFERENCES Ref_Gender(Id)
);

CREATE TABLE IF NOT EXISTS CR_Responses (
    UniId INT,
    Student INT,
    ResponseDate DATE,
    Ques INT,
    Stage INT,
    Response INT,
    PRIMARY KEY (UniId, Student, ResponseDate, Ques, Stage, Response),
    FOREIGN KEY (UniId) REFERENCES Uni(UniId),
    FOREIGN KEY (Stage) REFERENCES Stage(Stage)
);

-- Create EFT_CR_Q1Sequence table
CREATE TABLE IF NOT EXISTS EFT_CR_Q1Sequence (
    UniId INT,
    Student INT,
    Ques INT,
    Stage INT,
    PRIMARY KEY (UniId, Student, Ques, Stage),
    FOREIGN KEY (UniId) REFERENCES Uni(UniId),
    FOREIGN KEY (Stage) REFERENCES Stage(Stage)
);

