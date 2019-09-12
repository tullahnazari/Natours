const express = require('express');
const fs = require('fs');

const tours =JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
    );

exports.checkID = (req, res, next, val) => {
    if (req.params.id * 1 > tours.length)
      {
          return res.status(404).json({
              status: 'fail',
              message: 'Invalid ID'
          });
      }
      next();
}

exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours: tours
        }
    });
};


exports.getTourByID = (req, res) => {
    console.log(req.params);
    //convert id from string to int
    const id = req.params.id * 1;
    //finding the id in the array
    const tour = tours.find(el => el.id == id);
    //making sure the id exists in the array
    if (!tour)
    {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};  

exports.createTour = (req, res) => {
    //console.log(req.body);

    const newId = tours[tours.length - 1].id +1;
    const newTour = Object.assign({id: newId}, req.body);

    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, 
    JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'created',
            data: {
                tour: newTour
            }
        });
    
    });
};

exports.updateTour = (req, res) => {

      res.status(200).json({
          status: 'success',
          data: {
              tour: '<Updated tour here...>'
          }
      });
    };

exports.deleteTour = (req, res) => {
      res.status(204).json({
          status: 'success',
          data: {
              tour: null
          }
      });
    };
