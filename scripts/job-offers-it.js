    // Get the job offers list element
    const preadLoad = document.querySelector(".pre-load");
    const searchEl = document.querySelector(".c-job_offers-search_container");
    const filtersEl = document.querySelector(".c-job__offers--filters");
    const jobOffersList = document.querySelector(".c-job__offfers--results");
    const loadMoreButton = document.querySelector(".c-job__offfers--load-more");
    const searchInput = document.querySelector(".c-job__offers--search");
    const filterByLocation = document.querySelector(".js-filter--location");
    const filterByCompanySize = document.querySelector(".js-filter--company_size");
    const filterByWorkType = document.querySelector(".js-filter--worktype");
    const emptyStateMsg = document.querySelector(".c-job_offers--empty-state");
    const optionsfilterByWorkSchedule = document.querySelectorAll('.checkboxes input[type="checkbox"]');
    let jobOffersData = [];

    // Hide Filters and search bar on page load
    searchEl.style.display = 'none';
    filtersEl.style.display = 'none';


    // HTML structure for each job offer
    const jobOfferHtml = (jobOffer) => {
        let companyLogoHtml = `<img src="https://uploads-ssl.webflow.com/63e3bd4d4cb4c2dc125f9796/63ef94a99ee4283e1bbcd473_placeholder.png" style="opacity:0.3" alt="Logo" class="c-job__offers--company-logo">`;
        
        if (jobOffer.Company_logo) {
            companyLogoHtml = `<img src="${jobOffer.Company_logo}" alt="Logo" class="c-job__offers--company-logo" style="width:110px;height:110px; object-fit:scale-down;">`;
        } 

        let link = `${jobOffer.Job_Url}`;
        let website = `${jobOffer.Website}`;
        let websiteSnippet = '';
        let linkedin = `${jobOffer.Linkedin}`;

        if (!jobOffer.Job_Url.startsWith("http")) {
            link = `https://${jobOffer.Job_Url}`;
        }

        if (!jobOffer.Linkedin.startsWith("http")) {
            linkedin = `https://${jobOffer.Linkedin}`;
        }

        if (jobOffer.Website != null && jobOffer.Website !== '') {
            if (!jobOffer.Website.startsWith("http")) {
                website = `https://${jobOffer.Website}`;
            }
            websiteSnippet = `<div class="c-job__offers--company-details-col">
                    <p class="spec--title">Sito web</p>
                    <p class="spec--text">${website}</p>
                </div>`;
        }
 

        return `
            <div class="c-job__offfers--company-row" style="cursor:pointer;">
                <div class="c-job__offfers--company-header">
                    <div class="c-job__offers--company-details">
                        <div class="c-job__offers--company-details--header">
                            <div class="c-job__offers--company-details_col">
                                <h3 class="job-offers-title">${jobOffer.Company_Name}</h3>
                                <p class="job-offers-label--subtitle">${jobOffer.Job_Title}</p>
                            </div>
                            <div class="c-job__offers--company-details_col">
                                <p class="job-offers-label">${jobOffer.Sector}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="c-job__offers--company-extra_details">
                    <div class="c-job__offers--company-details-col">
                        <p class="spec--title">Descrizione</p>
                        <div class="spec--text">${jobOffer.Job_description}</div>
                    </div>
                    <div class="c-job__offers--company-details-col">
                        <p class="spec--title">Tipo di offerta</p>
                        <p class="spec--text">${jobOffer.Type_of_work}</p>
                    </div>
                    <div class="c-job__offers--company-details-col">
                        <p class="spec--title">Dimensioni dell'azienda</p>
                        <p class="spec--text">${jobOffer.Company_size} employees</p>
                    </div>
                    <div class="c-job__offers--company-details-col">
                        <p class="spec--title">Località</p>
                        <p class="spec--text">${jobOffer.Locations}</p>
                    </div>
                    ${websiteSnippet}
                    <div class="c-job__offers--company-links">
                        <a href="${link}" rel="nofollow" target="_blank" class="c-job__offers--visit-website orange-button">candidati ora</a>
                        <a href="${linkedin}" rel="nofollow" target="_blank" class="c-job__offers--visit-linkedin orange-button">linkedin</a>
                    </div>
                </div>
            </div>
        `;
    };

    // Fetch the job offers data from the API
    function fetchResults() {
        fetch(
            "https://coverflex-airtable-job-offers-proxy.netlify.app/joboffers-it"
        )
            .then((response) => response.json())
            .then((data) => {
                // Save the job offers data to a variable
                jobOffersData = data;
                // Slice the data to get the first 5 job offers
                const initialJobOffers = jobOffersData.slice(0, 5);
                // Loop through each job offer and create an HTML element for it
                initialJobOffers.forEach((jobOffer) => {
                    const jobOfferElement = document.createElement("div");


                    


                    jobOfferElement.innerHTML = jobOfferHtml(jobOffer);

                    // Hide preloader
                    preadLoad.style.display = "none";
                    loadMoreButton.style.display = "block";
                    // Append the job offer element to the job offers list
                    jobOffersList.appendChild(jobOfferElement);
                });

                // Display filters
                filtersEl.style.display = 'block';
                searchEl.style.display = 'block';
            })
            .catch((error) => {
                console.error("Error fetching job offers:", error);
            });
    }

    // run function
    fetchResults();
    

    // Add event listener to load more button
    loadMoreButton.addEventListener("click", () => {
        const selectedWorkType = filterByWorkType.value;
        const selectedLocation = filterByLocation.value;
        const selectedCompany = filterByCompanySize.value;
        const checkedWorkSchedule = Array.from(optionsfilterByWorkSchedule)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);

    //     // Filter job offers based on selected work type, location, and Remote_allowed
        const filteredJobOffers = jobOffersData.filter((jobOffer) => {
           return (
               (!selectedWorkType ||
                   jobOffer.Type_of_work === selectedWorkType) &&
               (!selectedCompany ||
                   jobOffer.Company_size === selectedCompany) 
                   &&
               (!selectedLocation ||
                   jobOffer.Locations.includes(selectedLocation)) 
                    &&
               (checkedWorkSchedule.length === 0 ||
                   checkedWorkSchedule.some((benefit) =>
                       jobOffer.Remote_allowed.includes(benefit)
                   ))
           );
       });

        // Slice the filtered job offers to get the next 5 job offers
        const additionalJobOffers = filteredJobOffers.slice(jobOffersList.children.length, jobOffersList.children.length + 5);

        // Loop through each job offer and create an HTML element for it
        additionalJobOffers.forEach(jobOffer => {
            const jobOfferElement = document.createElement("div");
            jobOfferElement.innerHTML = jobOfferHtml(jobOffer);
            // Append the job offer element to the job offers list
            jobOffersList.appendChild(jobOfferElement);
        });

        // Hide the load more button if there are no more job offers to display
        if (filteredJobOffers.length <= jobOffersList.children.length + additionalJobOffers.length) {
            loadMoreButton.style.display = "none";
        }
    });

    searchInput.addEventListener("keyup", () => {
        const searchTerm = searchInput.value.toLowerCase();
        // Filter the job offers data based on the search term
        const filteredJobOffers = jobOffersData.filter(jobOffer => {
            const company_name = jobOffer.Company_Name.toLowerCase();
            const location = jobOffer.Locations.toLowerCase();
            const sector = jobOffer.Sector.toLowerCase();
            return company_name.includes(searchTerm) || sector.includes(searchTerm)  || location.includes(searchTerm);
        });
        // Clear the job offers list
        jobOffersList.innerHTML = "";
        // Loop through each filtered job offer and create an HTML element for it
        filteredJobOffers.forEach(jobOffer => {
            const jobOfferElement = document.createElement("div");
            jobOfferElement.innerHTML = jobOfferHtml(jobOffer);
            // Append the job offer element to the job offers list
            jobOffersList.appendChild(jobOfferElement);
        });
        // Hide the load more button and remove the emptystate msg
        emptyStateMsg.style.display = "none";
        loadMoreButton.style.display = "none";


        // Show empty message if there are no more job offers to display
        if (!jobOffersList.children.length) {
            emptyStateMsg.style.display = "block";
        }
    });

    function filterJobOffers() {
        const selectedWorkType = filterByWorkType.value;
        const selectedLocation = filterByLocation.value;
        const selectedCompanySize = filterByCompanySize.value;
        const checkedWorkSchedule = Array.from(optionsfilterByWorkSchedule)
            .filter((checkbox) => checkbox.checked)
            .map((checkbox) => checkbox.value);


       const filteredJobOffers = jobOffersData.filter((jobOffer) => {
           return (
               (!selectedWorkType || jobOffer.Type_of_work === selectedWorkType) &&
               (!selectedCompanySize || jobOffer.Company_size === selectedCompanySize) 
               &&
               (!selectedLocation || jobOffer.Locations.includes(selectedLocation)) 
                   &&
               (checkedWorkSchedule.length === 0 ||
                   checkedWorkSchedule.some((benefit) =>
                       jobOffer.Remote_allowed.includes(benefit)
                   ))
           );
       });


        if (filteredJobOffers.length) {
            emptyStateMsg.style.display = "none";
            jobOffersList.innerHTML = "";
            filteredJobOffers.slice(0, 5).forEach((jobOffer) => {
                const jobOfferElement = document.createElement("div");
                jobOfferElement.innerHTML = jobOfferHtml(jobOffer);
                jobOffersList.appendChild(jobOfferElement);
            });

            loadMoreButton.style.display =
                filteredJobOffers.length > 5 ? "block" : "none";
        } else {
            jobOffersList.innerHTML = "";
            loadMoreButton.style.display = "none";
            emptyStateMsg.style.display = "block";
        }
    }

    filterByWorkType.addEventListener("change", filterJobOffers);

    filterByLocation.addEventListener("change", filterJobOffers);

    filterByCompanySize.addEventListener("change", filterJobOffers);

    optionsfilterByWorkSchedule.forEach((checkbox) => {
        checkbox.addEventListener("change", filterJobOffers);
    });

    // Add a click event listener to the document that will trigger when any element with class "c-job__offfers--company-row" is clicked
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("c-job__offfers--company-row")) {
            const el = event.target;
            el.classList.toggle("active");

            if (el.classList.contains("active")) {
                el.querySelector(".c-job__offers--company-extra_details").style.display = "flex";
            } else {
                el.querySelector(".c-job__offers--company-extra_details").style.display = "none";
            }
        }
    });


    // Reset all checkboxes and select tags
    function resetFilters() {
        // Reset checkboxes
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = false;
        }

        // Reset select tags
        var selectTags = document.querySelectorAll("select");
        for (var i = 0; i < selectTags.length; i++) {
            selectTags[i].selectedIndex = 0;
        }
    }

    window.onload = resetFilters;
