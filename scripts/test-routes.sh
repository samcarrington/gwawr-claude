#!/bin/bash

# Test Route Automation Script
# This script tests all routes and navigation functionality

set -e

BASE_URL="http://localhost:3001"
FAILED_TESTS=()
PASSED_TESTS=()

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test a route
test_route() {
    local route=$1
    local expected_code=${2:-200}
    local description=$3
    
    echo -n "Testing $description ($route)... "
    
    local response_code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
    
    if [ "$response_code" -eq "$expected_code" ]; then
        echo -e "${GREEN}PASS${NC} (HTTP $response_code)"
        PASSED_TESTS+=("$description")
    else
        echo -e "${RED}FAIL${NC} (Expected HTTP $expected_code, got $response_code)"
        FAILED_TESTS+=("$description - Expected $expected_code, got $response_code")
    fi
}

# Function to test route accessibility
test_accessibility() {
    local route=$1
    local description=$2
    
    echo -n "Testing accessibility for $description ($route)... "
    
    # Basic accessibility check - ensure page loads and has title
    local response=$(curl -s "$BASE_URL$route")
    
    if echo "$response" | grep -q "<title>" && echo "$response" | grep -q "</title>"; then
        echo -e "${GREEN}PASS${NC} (Has title tag)"
        PASSED_TESTS+=("$description - Accessibility")
    else
        echo -e "${RED}FAIL${NC} (Missing title tag)"
        FAILED_TESTS+=("$description - Accessibility - Missing title tag")
    fi
}

echo "🧪 Starting Route Testing Automation"
echo "========================================"

# Test all main routes
test_route "/" 200 "Home Page"
test_route "/projects" 200 "Projects Page"
test_route "/testimonials" 200 "Testimonials Page"
test_route "/blog" 200 "Blog Index Page"

# TODO: Replace hardcoded blog post slug with dynamic content discovery
# See task-17.1 for Contentful integration refactoring
test_route "/blog/building-scalable-vue-applications-composition-api" 200 "Blog Post Page"

# Test 404 handling
test_route "/nonexistent-page" 404 "404 Error Page"
test_route "/blog/nonexistent-post" 404 "404 Blog Post"

# Test accessibility
test_accessibility "/" "Home Page"
test_accessibility "/projects" "Projects Page"
test_accessibility "/testimonials" "Testimonials Page"
test_accessibility "/blog" "Blog Index Page"

echo ""
echo "📊 Test Results Summary"
echo "======================="
echo -e "${GREEN}Passed: ${#PASSED_TESTS[@]}${NC}"
echo -e "${RED}Failed: ${#FAILED_TESTS[@]}${NC}"

if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo ""
    echo -e "${RED}Failed Tests:${NC}"
    for test in "${FAILED_TESTS[@]}"; do
        echo -e "${RED}  ✗ $test${NC}"
    done
    exit 1
else
    echo ""
    echo -e "${GREEN}All tests passed! 🎉${NC}"
    exit 0
fi