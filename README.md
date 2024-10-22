# Car Parts and Supplier Management System

## Overview

This system is designed to manage data about car parts and their respective suppliers. It enforces certain business rules to ensure that each supplier can only supply one type of goods.

## Task Requirements

### Implementing the `handle` Method

Your task is to implement the `handle` method, which will be responsible for saving data about car parts and their supplier. 

### Requirements

1. Each supplier can only supply one type of goods (e.g., car parts of a specific type).
2. If needed, you are allowed to modify the function signatures or install additional packages to fulfill the task requirements.

## Request Body Examples

The following examples illustrate the expected structure of the request body when saving data:

### Example 1: Wheel Parts

```json
{
  "loader": {
    "loaderId": "12345",
    "loaderName": "John Doe"
  },
  "parts": [
    {
      "type": "wheel",
      "diameter": 22,
      "material": "rubber"
    },
    {
      "type": "wheel",
      "diameter": 18,
      "material": "rubber"
    }
  ]
}

{
  "loader": {
    "loaderId": "12345",
    "loaderName": "John Doe"
  },
  "parts": [
    {
      "type": "door",
      "height": 2.1,
      "width": 0.9,
      "material": "steel"
    },
    {
      "type": "door",
      "height": 2.0,
      "width": 0.8,
      "material": "aluminum"
    }
  ]
}

{
  "loader": {
    "loaderId": "12345",
    "loaderName": "John Doe"
  },
  "parts": [
    {
      "type": "window",
      "height": 1.2,
      "width": 1.0,
      "glassType": "tempered"
    },
    {
      "type": "window",
      "height": 1.5,
      "width": 1.2,
      "glassType": "laminated"
    }
  ]
}
```
