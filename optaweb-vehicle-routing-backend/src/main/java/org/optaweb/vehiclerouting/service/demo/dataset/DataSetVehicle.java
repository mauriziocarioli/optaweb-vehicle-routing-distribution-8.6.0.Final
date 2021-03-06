/*
 * Copyright 2020 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.optaweb.vehiclerouting.service.demo.dataset;

import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Data set vehicle.
 */
public class DataSetVehicle {

    @JsonProperty
    final String name;
    @JsonProperty
    final int capacity;
    @JsonProperty
    final HashSet<String> skillSet;

    @JsonCreator
    public DataSetVehicle(@JsonProperty("name") String name, @JsonProperty("capacity") int capacity,
            @JsonProperty("skillSet") HashSet<String> skillSet) {
        this.name = name;
        this.capacity = capacity;
        this.skillSet = skillSet;
    }
}
