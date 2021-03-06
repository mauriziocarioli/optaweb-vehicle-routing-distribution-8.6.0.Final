/*
 * Copyright 2018 Red Hat, Inc. and/or its affiliates.
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

package org.optaweb.vehiclerouting.plugin.rest.model;

import java.math.BigDecimal;
import java.util.Objects;

import org.optaweb.vehiclerouting.domain.Location;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * {@link Location} representation convenient for marshalling.
 */
public class PortableLocation {

    private final long id;

    @JsonProperty(value = "lat", required = true)
    private final BigDecimal latitude;
    @JsonProperty(value = "lng", required = true)
    private final BigDecimal longitude;
    @JsonProperty(value = "requiredSkill", required = true)
    private final String requiredSkill;

    private final String description;

    static PortableLocation fromLocation(Location location) {
        Objects.requireNonNull(location, "location must not be null");
        return new PortableLocation(
                location.id(),
                location.coordinates().latitude(),
                location.coordinates().longitude(),
                location.requiredSkill(),
                location.description());
    }

    @JsonCreator
    public PortableLocation(
            @JsonProperty(value = "id") long id,
            @JsonProperty(value = "lat") BigDecimal latitude,
            @JsonProperty(value = "lng") BigDecimal longitude,
            @JsonProperty(value = "requiredSkill") String requiredSkill,
            @JsonProperty(value = "description") String description) {
        this.id = id;
        this.latitude = Objects.requireNonNull(latitude);
        this.longitude = Objects.requireNonNull(longitude);
        this.requiredSkill = Objects.requireNonNull(requiredSkill);
        this.description = Objects.requireNonNull(description);
    }

    public long getId() {
        return id;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public String getRequiredSkill() {
        return requiredSkill;
    }

    public String getDescription() {
        return description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PortableLocation that = (PortableLocation) o;
        return id == that.id &&
                requiredSkill.equals(that.requiredSkill) &&
                description.equals(that.description) &&
                latitude.compareTo(that.latitude) == 0 &&
                longitude.compareTo(that.longitude) == 0;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, description, requiredSkill, latitude, longitude);
    }

    @Override
    public String toString() {
        return "PortableLocation{" +
                "id=" + id +
                ", description='" + description + "'" +
                ", requiredSkill='" + requiredSkill + "'" +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                '}';
    }
}
