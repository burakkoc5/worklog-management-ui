# Worklog API Documentation

This document provides detailed information about the controllers and endpoints available in the Worklog API.

## Table of Contents
1. [Employee Controller](#employee-controller)
2. [Grade Controller](#grade-controller)
3. [Worklog Controller](#worklog-controller)
4. [Worklog Type Controller](#worklog-type-controller)

## Employee Controller

Base URL: `/api/employees`

### Endpoints

#### 1. Get All Employees
- **Method:** GET
- **URL:** `/api/employees`
- **Query Parameters:**
  - `page` (optional, default: 0): Page number
  - `size` (optional, default: 10): Number of items per page
  - `sortBy` (optional, default: "id"): Field to sort by
  - `sortDirection` (optional, default: "asc"): Sort direction ("asc" or "desc")
- **Response:** Page of EmployeeResponseDto

#### 2. Get Employee by ID
- **Method:** GET
- **URL:** `/api/employees/{id}`
- **Path Variable:** `id` (Long)
- **Response:** EmployeeResponseDto

#### 3. Create Employee
- **Method:** POST
- **URL:** `/api/employees`
- **Request Body:** CreateEmployeeDto (JSON)
- **Response:** EmployeeResponseDto

#### 4. Update Employee
- **Method:** PUT
- **URL:** `/api/employees/{id}`
- **Path Variable:** `id` (Long)
- **Request Body:** UpdateEmployeeDto (JSON)
- **Response:** EmployeeResponseDto

#### 5. Delete Employee
- **Method:** DELETE
- **URL:** `/api/employees/{id}`
- **Path Variable:** `id` (Long)
- **Response:** No content (204)

## Grade Controller

Base URL: `/api/grades`

### Endpoints

#### 1. Get All Grades
- **Method:** GET
- **URL:** `/api/grades`
- **Query Parameters:**
  - `page` (optional, default: 0): Page number
  - `size` (optional, default: 10): Number of items per page
  - `sortBy` (optional, default: "id"): Field to sort by
  - `sortDirection` (optional, default: "asc"): Sort direction ("asc" or "desc")
- **Response:** Page of GradeResponseDto

#### 2. Get Grade by ID
- **Method:** GET
- **URL:** `/api/grades/{id}`
- **Path Variable:** `id` (Long)
- **Response:** GradeResponseDto

#### 3. Create Grade
- **Method:** POST
- **URL:** `/api/grades`
- **Request Body:** CreateGradeDto (JSON)
- **Response:** GradeResponseDto

#### 4. Update Grade
- **Method:** PUT
- **URL:** `/api/grades/{id}`
- **Path Variable:** `id` (Long)
- **Request Body:** UpdateGradeDto (JSON)
- **Response:** GradeResponseDto

#### 5. Delete Grade
- **Method:** DELETE
- **URL:** `/api/grades/{id}`
- **Path Variable:** `id` (Long)
- **Response:** No content (204)

## Worklog Controller

Base URL: `/api/worklogs`

### Endpoints

#### 1. Get All Worklogs
- **Method:** GET
- **URL:** `/api/worklogs`
- **Query Parameters:**
  - `page` (optional, default: 0): Page number
  - `size` (optional, default: 10): Number of items per page
  - `sortBy` (optional, default: "id"): Field to sort by
  - `sortDirection` (optional, default: "asc"): Sort direction ("asc" or "desc")
- **Response:** Page of WorklogResponseDto

#### 2. Get Worklog by ID
- **Method:** GET
- **URL:** `/api/worklogs/{id}`
- **Path Variable:** `id` (Long)
- **Response:** WorklogResponseDto

#### 3. Create Worklog
- **Method:** POST
- **URL:** `/api/worklogs`
- **Request Body:** CreateWorklogDto (JSON)
- **Response:** WorklogResponseDto

#### 4. Update Worklog
- **Method:** PUT
- **URL:** `/api/worklogs/{id}`
- **Path Variable:** `id` (Long)
- **Request Body:** UpdateWorklogDto (JSON)
- **Response:** WorklogResponseDto

#### 5. Delete Worklog
- **Method:** DELETE
- **URL:** `/api/worklogs/{id}`
- **Path Variable:** `id` (Long)
- **Response:** No content (204)

## Worklog Type Controller

Base URL: `/api/worklog-types`

### Endpoints

#### 1. Get All Worklog Types
- **Method:** GET
- **URL:** `/api/worklog-types`
- **Query Parameters:**
  - `page` (optional, default: 0): Page number
  - `size` (optional, default: 10): Number of items per page
  - `sortBy` (optional, default: "id"): Field to sort by
  - `sortDirection` (optional, default: "asc"): Sort direction ("asc" or "desc")
- **Response:** Page of WorklogTypeResponseDto

#### 2. Get Worklog Type by ID
- **Method:** GET
- **URL:** `/api/worklog-types/{id}`
- **Path Variable:** `id` (Long)
- **Response:** WorklogTypeResponseDto

#### 3. Create Worklog Type
- **Method:** POST
- **URL:** `/api/worklog-types`
- **Request Body:** CreateWorklogTypeDto (JSON)
- **Response:** WorklogTypeResponseDto

#### 4. Update Worklog Type
- **Method:** PUT
- **URL:** `/api/worklog-types/{id}`
- **Path Variable:** `id` (Long)
- **Request Body:** UpdateWorklogTypeDto (JSON)
- **Response:** WorklogTypeResponseDto

#### 5. Delete Worklog Type
- **Method:** DELETE
- **URL:** `/api/worklog-types/{id}`
- **Path Variable:** `id` (Long)
- **Response:** No content (204)

## Data Transfer Objects (DTOs)

### Employee DTOs
- **CreateEmployeeDto:** Contains fields for creating a new employee (firstName, lastName, gradeId, teamLeadId, directorId, startDate, endDate)
- **UpdateEmployeeDto:** Contains fields for updating an existing employee (id, firstName, lastName, gradeId, teamLeadId, directorId, startDate, endDate)
- **EmployeeResponseDto:** Contains fields returned in employee responses (id, firstName, lastName, gradeId, gradeName, teamLeadId, teamLeadName, directorId, directorName, startDate, endDate)

### Grade DTOs
- **CreateGradeDto:** Contains fields for creating a new grade (name)
- **UpdateGradeDto:** Contains fields for updating an existing grade (name)
- **GradeResponseDto:** Contains fields returned in grade responses (id, name)

### Worklog DTOs
- **CreateWorklogDto:** Contains fields for creating a new worklog (employeeId, monthDate, worklogTypeId, effort)
- **UpdateWorklogDto:** Contains fields for updating an existing worklog (similar to CreateWorklogDto, but all fields are optional)
- **WorklogResponseDto:** Contains fields returned in worklog responses (id, employeeId, employeeName, monthDate, worklogTypeId, worklogTypeName, effort)

### Worklog Type DTOs
- **CreateWorklogTypeDto:** Contains fields for creating a new worklog type (name)
- **UpdateWorklogTypeDto:** Contains fields for updating an existing worklog type (name)
- **WorklogTypeResponseDto:** Contains fields returned in worklog type responses (id, name)

Note: All DTOs use appropriate data types (e.g., Long for IDs, String for names, LocalDate for dates, YearMonth for month dates, Integer for effort).

