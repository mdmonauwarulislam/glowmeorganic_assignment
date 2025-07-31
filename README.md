# Art Institute of Chicago - React DataTable Assignment

This is a TypeScript + Vite-based React assignment that uses PrimeReact's `DataTable` component to fetch and display paginated artwork data from the [Art Institute of Chicago API](https://api.artic.edu/api/v1/artworks). The assignment satisfies all criteria mentioned in the provided video and documentation, including server-side pagination, persistent checkbox-based row selection across pages, and minimalistic UI styling.

> ❗ **AI WARNING**: This submission contains no AI-generated core logic. All main functionalities and logic are written by hand, based on the assignment documentation and video explanations.

---

## Deployment

**Live App:** [https://glowmeorganic.netlify.app/](https://glowmeorganic.netlify.app/)  
**GitHub Repo:** [https://github.com/mdmonauwarulislam/glowmeorganic_assignment.git](https://github.com/mdmonauwarulislam/glowmeorganic_assignment.git)

---

## 📹 Resources

- **Assignment Video Explanation:** `react assignment explaination.mp4`
- **Checklist Before Submission:** `checks before submission.mp4`
- **API Endpoint Used:**  
  `https://api.artic.edu/api/v1/artworks?page=<page_number>`

---

## Features

### Server-Side Pagination

- Fetches data **only for the requested page** from API.
- Uses `onPage` event from PrimeReact's `DataTable` component.
- Every page change results in a fresh API call.
- **No client-side caching** of data from previous pages to avoid memory bloat.

### Minimalist PrimeReact DataTable

- Built using [PrimeReact DataTable](https://primereact.org/datatable/)
- Clean styling with centered layout
- Only required fields are displayed

### Custom Checkbox-Based Row Selection (Persistent Across Pages)

- Users can select rows via checkboxes
- Row selections **persist across pages**
- Selection is implemented using a `Map<number, Apitypes>` to track selected artwork by `id`
- Includes a custom selection overlay panel to bulk select *n* rows

### Componentized + Typed Code

- Developed using **TypeScript**
- Interfaces for API response and artwork defined in `src/types/apitypes.ts`
- Modular and readable code structure


---

## Tech Stack

- **Framework:** [React](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Language:** TypeScript
- **UI Library:** [PrimeReact](https://primereact.org/)
- **HTTP Client:** Axios


---

## Steps to Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/mdmonauwarulislam/glowmeorganic_assignment.git
cd art-datatable-assignment

# 2. Install dependencies
npm install

# 3. Run dev server
npm run dev