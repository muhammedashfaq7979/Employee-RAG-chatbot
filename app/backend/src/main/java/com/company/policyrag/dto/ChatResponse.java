package com.company.policyrag.dto;

import java.util.List;

public class ChatResponse {
    private String answer;
    private List<Citation> citations;
    private boolean foundInPolicies;

    public ChatResponse() {}

    public ChatResponse(String answer, List<Citation> citations, boolean foundInPolicies) {
        this.answer = answer;
        this.citations = citations;
        this.foundInPolicies = foundInPolicies;
    }

    public static class Citation {
        private String sourceFile;
        private Object pageNumber;
        private String excerpt;

        public Citation() {}

        public Citation(String sourceFile, Object pageNumber, String excerpt) {
            this.sourceFile = sourceFile;
            this.pageNumber = pageNumber;
            this.excerpt = excerpt;
        }

        public String getSourceFile() {
            return sourceFile;
        }

        public void setSourceFile(String sourceFile) {
            this.sourceFile = sourceFile;
        }

        public Object getPageNumber() {
            return pageNumber;
        }

        public void setPageNumber(Object pageNumber) {
            this.pageNumber = pageNumber;
        }

        public String getExcerpt() {
            return excerpt;
        }

        public void setExcerpt(String excerpt) {
            this.excerpt = excerpt;
        }
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public List<Citation> getCitations() {
        return citations;
    }

    public void setCitations(List<Citation> citations) {
        this.citations = citations;
    }

    public boolean isFoundInPolicies() {
        return foundInPolicies;
    }

    public void setFoundInPolicies(boolean foundInPolicies) {
        this.foundInPolicies = foundInPolicies;
    }
}
